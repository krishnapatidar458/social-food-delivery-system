import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { Post } from "../models/post.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is Missing, Please Check!",
        success: true,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Email Already Exists!",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account Successfully created",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is Missing, Please Check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email Not Exists",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorret Email or Password",
        success: false,
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    //populate each post if in the posts array

    // const populatedPosts = await Promise.all(
    //   user.posts.map(async (postId) => {
    //     const post = await Post.findById(postId);

    //     if (post.author.equals(user._id)) {
    //       return post;
    //     }
    //     return null;
    //   })
    // );

    // user = {
    //   _id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   profilePicture: user.profilePicture,
    //   bio: user.bio,
    //   followers: user.followers,
    //   followings: user.followings,
    //   posts: populatedPosts,
    // };

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);

        if (post && post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    // Optional: filter out null posts
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      followings: user.followings,
      posts: populatedPosts.filter(Boolean), // filters out nulls
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged Out Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");
    console.log(user);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({
      message: "Profile Updated.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUser) {
      return res.status(400).json({
        message: "No Users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET /api/v1/user/followings
export const getFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("followings");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      followings: user.followings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followerId = req.id; // ID of user who follows/unfollows
    const targetUserId = req.params.id; // ID of user being followed/unfollowed
    
    // Input validation
    if (!targetUserId || !targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false
      });
    }
    
    // Prevent self-following
    if (followerId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        success: false
      });
    }
    
    // Find both users with minimal projections for efficiency
    const [follower, targetUser] = await Promise.all([
      User.findById(followerId).select("username followings"),
      User.findById(targetUserId).select("username followers")
    ]);

    // Check if both users exist
    if (!follower) {
      return res.status(404).json({
        message: "Your user account was not found",
        success: false
      });
    }
    
    if (!targetUser) {
      return res.status(404).json({
        message: "The user you're trying to follow was not found",
        success: false
      });
    }
    
    // Check if already following
    const isFollowing = follower.followings.includes(targetUserId);
    
    // Get receiver socket ID for real-time notification
    const receiverSocketId = getReceiverSocketId(targetUserId);
    
    if (isFollowing) {
      // UNFOLLOW LOGIC
      try {
        // Use Promise.all for parallel execution of both updates
        await Promise.all([
          User.findByIdAndUpdate(
            followerId,
            { $pull: { followings: targetUserId } },
            { new: true }
          ),
          User.findByIdAndUpdate(
            targetUserId,
            { $pull: { followers: followerId } },
            { new: true }
          )
        ]);
        
        // Send real-time notification for unfollow (optional)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("userUnfollowed", {
            userId: followerId,
            username: follower.username
          });
        }
        
        return res.status(200).json({ 
          message: `You have unfollowed ${targetUser.username}`, 
          success: true,
          isFollowing: false,
          follower: {
            id: followerId,
            username: follower.username
          },
          targetUser: {
            id: targetUserId,
            username: targetUser.username
          }
        });
      } catch (updateError) {
        console.error("Error during unfollow update:", updateError);
        return res.status(500).json({
          message: "Failed to unfollow user",
          success: false
        });
      }
    } else {
      // FOLLOW LOGIC
      try {
        // Use Promise.all for parallel execution of both updates
        const [updatedFollower, updatedTarget] = await Promise.all([
          User.findByIdAndUpdate(
            followerId,
            { $addToSet: { followings: targetUserId } },
            { new: true }
          ).select("username followings"),
          
          User.findByIdAndUpdate(
            targetUserId,
            { $addToSet: { followers: followerId } },
            { new: true }
          ).select("username followers")
        ]);
        
        // Create database notification
        const { createNotification } = await import("./notification.controller.js");
        const notification = await createNotification(
          followerId,
          targetUserId,
          "follow",
          `${follower.username} started following you`
        );
        
        // Send real-time follow notification
        if (receiverSocketId) {
          // Send populated notification data for immediate display
          const populatedNotification = await notification.populate("sender", "username profilePicture");
          
          io.to(receiverSocketId).emit("newNotification", populatedNotification);
          
          // Also emit a specific follow event for real-time UI updates
          io.to(receiverSocketId).emit("userFollowed", {
            userId: followerId,
            username: follower.username,
            notificationId: notification?._id
          });
        }
        
        return res.status(200).json({ 
          message: `You are now following ${targetUser.username}`, 
          success: true,
          isFollowing: true,
          follower: {
            id: followerId,
            username: updatedFollower.username,
            followingCount: updatedFollower.followings.length
          },
          targetUser: {
            id: targetUserId,
            username: updatedTarget.username,
            followerCount: updatedTarget.followers.length
          }
        });
      } catch (updateError) {
        console.error("Error during follow update:", updateError);
        return res.status(500).json({
          message: "Failed to follow user",
          success: false
        });
      }
    }
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    return res.status(500).json({
      message: "Server error while processing follow/unfollow request",
      success: false,
      error: error.message
    });
  }
};

// Get user statistics (followers/followings count)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate user ID
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }
    
    // Find user and count followers/followings
    const user = await User.findById(userId).select("followers followings");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      userId,
      followerCount: user.followers.length,
      followingCount: user.followings.length
    });
    
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user statistics"
    });
  }
};
