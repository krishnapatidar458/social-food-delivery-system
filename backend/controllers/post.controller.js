import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import Story from "../models/Story.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import streamifier from "streamifier";

// export const addNewPost = async (req, res) => {
//   try {
//     const { caption } = req.body;
//     const image = req.file;
//     const authorId = req.id;
//     if (!image) return res.status(400).json({ message: "Image Required" });

//     //image (optimization)
//     const optimizedImageBuffer = await sharp(image.buffer)
//       .resize({ width: 800, height: 800, fit: "inside" })
//       .toFormat("jpeg", { quality: 90 })
//       .toBuffer();

//     //uploading to cloudinary
//     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
//       "base64"
//     )}`;
//     const cloudResponse = await cloudinary.uploader.upload(fileUri);
//     const post = await Post.create({
//       caption,
//       image: cloudResponse.secure_url,
//       author: authorId,
//     });

//     const user = await User.findById(authorId);
//     if (user) {
//       user.posts.push(post._id);
//       await user.save();
//     }

//     await post.populate({ path: "author", select: "-password" });

//     return res.status(201).json({
//       message: "New Post Added",
//       post,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const addNewPost = async (req, res) => {
  try {
    const { caption, price,category } = req.body;
    const file = req.file;
    const mediaType = file?.mimetype.split("/")[0]; // 'image' or 'video'
    const authorId = req.id;

    if (!file) {
      return res
        .status(400)
        .json({ message: "Media Required", success: false });
    }

    let mediaUrl = null;

    if (mediaType === "image") {
      // Optimize and upload image
      const optimizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 90 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;

      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        resource_type: "image",
      });

      mediaUrl = cloudResponse.secure_url;
    } else if (mediaType === "video") {
      // Stream upload video to Cloudinary
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              timeout: 60000,
              chunk_size: 60000000,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      mediaUrl = result.secure_url;
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported media type", success: false });
    }

    // Save post to DB
    const post = await Post.create({
      caption,
      price,
      category,
      author: authorId,
      mediaType,
      image: mediaType === "image" ? mediaUrl : undefined,
      video: mediaType === "video" ? mediaUrl : undefined,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post Added",
      post,
      success: true,
    });
  } catch (error) {
    console.error("Add New Post Error:", error);
    res.status(500).json({ message: "Internal Error", success: false });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const posts = await Post.find({ createdAt: { $gte: threeHoursAgo } })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.error("Get all posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching posts: " + error.message
    });
  }
};

// export const getUserPost = async (req, res) => {
//   try {
//     const authorId = req.id;
//     const posts = await Post.find({ author: authorId })
//       .sort({ createdAt: -1 })
//       .populate({ path: "author", select: "username , profilePicture" })
//       .populate({
//         path: "comments",
//         sort: { createdAt: -1 },
//         populate: {
//           path: "author",
//           select: "username , profilePicture",
//         },
//       });
//     return res.status(200).json({
//       posts,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    
    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found, please login again"
      });
    }
    
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
      
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user posts: " + error.message
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const likingUserId = req.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: "Post Not Found", 
        success: false 
      });
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(likingUserId);
    if (alreadyLiked) {
      return res.status(400).json({ 
        message: "You already liked this post", 
        success: false 
      });
    }
    
    // Add user to likes array
    await post.updateOne({ $addToSet: { likes: likingUserId } });
    await post.save();

    // Get post author ID
    const postOwnerId = post.author.toString();
    
    // Only create notification if post owner is not the same as the liker
    if (postOwnerId !== likingUserId) {
      // Get user details for notification
      const user = await User.findById(likingUserId).select("username profilePicture");
      
      // Create notification for database
      try {
        const { createNotification } = await import("./notification.controller.js");
        await createNotification(
          likingUserId,
          postOwnerId,
          "like",
          `${user.username} liked your post`,
          postId
        );
      } catch (notificationError) {
        console.error("Failed to create like notification:", notificationError);
        // Continue even if notification fails
      }
      
      // Real-time socket notification
      const notification = {
        type: "like",
        userId: likingUserId,
        userDetails: user,
        postId,
        message: "Your Post Was Liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", notification);
      }
    }

    return res.status(200).json({ 
      message: "Post Liked", 
      success: true,
      likesCount: post.likes.length + 1
    });
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({
      message: "Server error while liking post",
      success: false
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: "Post Not Found", 
        success: false 
      });
    }
    
    // Check if user had liked the post
    const hadLiked = post.likes.includes(userId);
    if (!hadLiked) {
      return res.status(400).json({ 
        message: "You haven't liked this post yet", 
        success: false 
      });
    }
    
    // Remove user from likes array
    await post.updateOne({ $pull: { likes: userId } });
    await post.save();

    // Get post author ID
    const postOwnerId = post.author.toString();
    
    // Only send real-time notification if post owner is not the same as the user
    if (postOwnerId !== userId) {
      // Get user details for notification
      const user = await User.findById(userId).select("username profilePicture");
      
      // Real-time socket notification
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your Post Was Unliked",
      };
      
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", notification);
      }
    }

    return res.status(200).json({ 
      message: "Post Unliked", 
      success: true,
      likesCount: post.likes.length - 1
    });
  } catch (error) {
    console.error("Unlike post error:", error);
    return res.status(500).json({
      message: "Server error while unliking post",
      success: false
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
        success: false,
      });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }
    
    // Create new comment
    const comment = await Comment.create({
      text,
      author: authorId,
      post: postId,
    });
    
    // Populate author information
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });
    
    // Update post's comments array
    post.comments.push(comment._id);
    await post.save();
    
    // Get post owner ID
    const postOwnerId = post.author.toString();
    
    // Only create notification if post owner is not the comment author
    if (postOwnerId !== authorId) {
      try {
        // Get commenter details
        const commenter = await User.findById(authorId).select("username profilePicture");
        
        // Create notification in database
        const { createNotification } = await import("./notification.controller.js");
        await createNotification(
          authorId,
          postOwnerId,
          "comment",
          `${commenter.username} commented on your post: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
          postId,
          comment._id
        );
        
        // Send real-time notification
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        if (postOwnerSocketId) {
          io.to(postOwnerSocketId).emit("notification", {
            type: "comment",
            userId: authorId,
            userDetails: commenter,
            postId,
            commentId: comment._id,
            text: text.substring(0, 50),
            message: "Someone commented on your post",
          });
        }
      } catch (notificationError) {
        console.error("Failed to create comment notification:", notificationError);
        // Continue even if notification fails
      }
    }
    
    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
      commentsCount: post.comments.length
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({
      message: "Server error while adding comment",
      success: false
    });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    if (!postId) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID is required" 
      });
    }
    
    try {
      const comments = await Comment.find({ post: postId }).populate(
        "author",
        "username profilePicture"
      );
      
      if (!comments || comments.length === 0) {
        return res.status(200).json({ 
          success: true, 
          message: "No Comments", 
          comments: [] 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        comments 
      });
    } catch (findError) {
      if (findError.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: "Invalid post ID"
        });
      }
      throw findError;
    }
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments: " + error.message
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });
    //checking if the logged in user is owner of the post
    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorised" });
    //deleting the post
    await Post.findByIdAndDelete(postId);
    // removing the post id also from user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();
    //deleting associated comments with the post
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      success: true,
      message: "Post Deleted",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting post: " + error.message
    });
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //already bookmarked--> unBookmarked
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from Bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post  Bookmarked", success: true });
    }
  } catch (error) {
    console.error("Bookmark post error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while bookmarking post: " + error.message
    });
  }
};

// Add the getSinglePost controller function to get a single post by ID
export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }
    
    // Try to find the post without validation
    try {
      const post = await Post.findById(postId)
        .populate({ path: "author", select: "username profilePicture" })
        .populate({
          path: "comments",
          sort: { createdAt: -1 },
          populate: {
            path: "author",
            select: "username profilePicture",
          },
        });
        
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        post,
      });
    } catch (findError) {
      // If the error is a CastError (invalid ID format), return a more user-friendly message
      if (findError.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: "Invalid post ID",
        });
      }
      // Otherwise rethrow the error to be caught by the outer catch block
      throw findError;
    }
  } catch (error) {
    console.error("Error fetching single post:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};


