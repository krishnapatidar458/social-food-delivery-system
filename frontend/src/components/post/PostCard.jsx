import React, { useState, useEffect, useRef } from "react";
import { FiHeart, FiMessageCircle, FiSend } from "react-icons/fi";
import { FcLike } from "react-icons/fc";
import { Avatar, Badge, Menu, MenuItem } from "@mui/material";
import CommentDialog from "../comment/CommentDialog";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setPosts, setSelectedPost } from "../../redux/postSlice";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../redux/cartSlice";
import { setLikeNotification } from "../../redux/rtnSlice";

const PostCard = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts } = useSelector((store) => store.post);
  const { cartItems } = useSelector((store) => store.cart);

  const handleLike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked
          ? post.likes.filter((id) => id !== user._id)
          : [...post.likes, user._id];

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        );

        dispatch(setPosts(updatedPosts));

        setLiked(!liked);
        
        setLikeCount(updatedLikes.length);
        dispatch(
          setLikeNotification({
            type: "like",
            user: user.username,
            postId: post._id,
            time: Date.now(),
          })
        );
        
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating like.");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text: commentText },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);
        setCommentText("");

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Comment failed.");
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));

        // Remove from cart if present
        dispatch(removeFromCart(post._id));

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Deletion failed.");
    }
  };

  const addToCartHandler = () => {
    const cartItem = {
      _id: post._id,
      name: post.caption,
      image: post.image,
      quantity: post.quantity,
      video: post.video,
      price: post.price,
    };

    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?._id}`}>
            {post.author?._id === user?._id ? (
              <Badge color="primary" variant="dot">
                <Avatar
                  alt="User"
                  src={post?.author?.profilePicture}
                  className="w-13 h-13"
                />
              </Badge>
            ) : (
              <Avatar
                alt="User"
                src={post?.author?.profilePicture}
                className="w-13 h-13"
              />
            )}
          </Link>

          <div>
            <h4
              onClick={() => navigate(`/profile/${post.author._id}`)}
              className="font-semibold text-gray-800 cursor-pointer"
            >
              {post.author.username}
            </h4>
            <p className="text-sm text-gray-500">
              {post.location} • {post.distance} km
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={handleMenuOpen}
            className="text-gray-600 hover:text-gray-900 transition text-2xl"
          >
            ⋮
          </button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Share</MenuItem>
            <MenuItem onClick={handleMenuClose}>Add to Favorites</MenuItem>
            {user?._id === post.author._id && (
              <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
            )}
          </Menu>
        </div>
      </div>

      <div className="w-full h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
        {post.mediaType === "video" ? (
          <video
            src={post.video}
            controls
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <p className="text-gray-800 mb-2">{post.caption}</p>

        <div className="flex items-center justify-between mb-2">
          <p className="text-yellow-500 font-bold">
            {"⭐".repeat(post.ratings)}
          </p>

          {post.quantity > 0 ? (
            cartItems.some((item) => item._id === post._id) ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(decreaseQuantity({ _id: post._id }))}
                  className="bg-red-200 px-2 rounded-md text-lg"
                >
                  -
                </button>
                <span>
                  {cartItems.find((item) => item._id === post._id)?.quantity ||
                    0}
                </span>
                <button
                  onClick={() => dispatch(increaseQuantity({ _id: post._id }))}
                  className="bg-green-200 px-2 rounded-md text-lg"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={addToCartHandler}
                className="px-3 py-1 text-sm bg-red-100 text-red-500 rounded-md hover:bg-red-200"
              >
                Add ₹{post.price}
              </button>
            )
          ) : (
            <span className="text-gray-400 italic">Out of stock</span>
          )}
        </div>

        <div className="flex items-center gap-6 text-gray-600 text-xl">
          <button onClick={handleLike} className="transition cursor-pointer">
            {liked ? <FcLike className="text-2xl" /> : <FiHeart />}
          </button>

          <button
            onClick={() => {
              dispatch(setSelectedPost(post));
              setCommentDialogOpen(true);
            }}
            className="hover:text-blue-500 transition cursor-pointer"
          >
            <FiMessageCircle />
          </button>

          <button className="hover:text-green-500 transition cursor-pointer">
            <FiSend />
          </button>
        </div>

        <span className="font-md block my-2">{likeCount} likes</span>
        {comments.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setCommentDialogOpen(true);
            }}
            className="hover:text-blue-300 cursor-pointer"
          >
            View all {comments.length} comments
          </span>
        )}

        <CommentDialog
          open={commentDialogOpen}
          setOpen={setCommentDialogOpen}
          post={post}
        />

        <div className="flex item-center justify-between mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          {commentText.trim() && (
            <span
              onClick={handleComment}
              className="text-[#3BADF8] cursor-pointer"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
