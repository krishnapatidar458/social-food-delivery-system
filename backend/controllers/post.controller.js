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

// export const getAllPost = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .sort({ createdAt: -1 })
//       .populate({ path: "author", select: "username profilePicture" })
//       .populate({
//         path: "comments",
//         sort: { createdAt: -1 },
//         populate: {
//           path: "author",
//           select: "username profilePicture",
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
    console.log(error);
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
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username , profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username , profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const likeKrnewalaUserId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });
    //logic for to  like the post
    await post.updateOne({ $addToSet: { likes: likeKrnewalaUserId } });
    await post.save();

    //implementing socketio for real time notification
    const user = await User.findById(likeKrnewalaUserId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrnewalaUserId) {
      //emit notification
      const notification = {
        type: "like",
        userId: likeKrnewalaUserId,
        userDetails: user,
        postId,
        message: "Your Post Was Liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);

      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post Liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const likeKrnewalaUserId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });
    //logic for to  like the post
    await post.updateOne({ $pull: { likes: likeKrnewalaUserId } });
    await post.save();

    //implementing socketio for real time notification
    const user = await User.findById(likeKrnewalaUserId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrnewalaUserId) {
      //emit notification
      const notification = {
        type: "dislike",
        userId: likeKrnewalaUserId,
        userDetails: user,
        postId,
        message: "Your Post Was disLiked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
      console.log("post disliked ", notification);
    }

    return res.status(200).json({ message: "Post disLiked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentkarneWalaUserKiId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "Text is Required", success: false });
    const comment = await Comment.create({
      text,
      author: commentkarneWalaUserKiId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username  profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCommentsOfPost = async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "userName  profilePicture"
  );
  if (!comments)
    return res.status(200).json({ message: "No Comments", success: false });
  return res.status(200).json({ sucess: true, comments });
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
    console.log(error);
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
    console.log(error);
  }
};
