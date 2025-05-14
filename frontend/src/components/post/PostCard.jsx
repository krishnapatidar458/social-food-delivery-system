import React, { useState, useEffect, useRef } from "react";
import { FiHeart, FiMessageCircle, FiSend } from "react-icons/fi"; // Outline Icons
import { FcLike } from "react-icons/fc"; // Filled Heart Icon
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Chip,
  Badge,
} from "@mui/material";
import CommentDialog from "../comment/CommentDialog";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setPosts, setSelectedPost } from "../../redux/postSlice";

const PostCard = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false); // Updated: State for liked/unliked
  const optionsRef = useRef();
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState(post.comments);
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const commmentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeOrDislikeHandler = async (postId) => {
    try {
      const action = likes ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${postId}/${action}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedLikes = likes ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLikes(!likes);
        const updatedPostData = posts.map((p) => {
          return p._id === post._id
            ? {
                ...p,
                likes: likes
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p;
        });
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.success(error.response.data.message);
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions]);

  // Handle like button click

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-6 max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto">
      {/* {user?._id === post.author._id && setInvisible(true)} */}

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user?._id}`}>
            {post.author?._id === user?._id ? (
              <Badge color="primary" variant="dot" >
                <Avatar
                  alt="Remy Sharp"
                  src={post.author?.userProfile}
                  className="w-13 h-13 rounded-full object-cover"
                />
              </Badge>
            ) : (
              <Avatar
                alt="Remy Sharp"
                src={post.author?.userProfile}
                className="w-13 h-13 rounded-full object-cover"
              />
            )}
          </Link>

          <div>
            <h4
              onClick={() => navigate("/profile")}
              className="font-semibold text-gray-800 cursor-pointer"
            >
              {post.author?.username}
            </h4>

            <p className="text-sm text-gray-500">
              {post.location} • {post.distance} km
            </p>
          </div>
        </div>
        <div className="relative">
          <div>
            <button
              onClick={handleOpenDialog}
              className="text-gray-600 hover:text-gray-900 transition text-2xl"
            >
              ⋮
            </button>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogContent dividers>
                <Button fullWidth onClick={handleCloseDialog}>
                  Share
                </Button>
                <Button fullWidth onClick={handleCloseDialog}>
                  Add to Favorite
                </Button>
                {user && user?._id === post?.author._id && (
                  <Button fullWidth onClick={deletePostHandler}>
                    Delete
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Options Dialog */}
        </div>
      </div>
      {/* Post Image or Video */}
      <div className="w-full h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
        {post?.mediaType === "video" ? (
          <video
            src={post?.video}
            controls
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post?.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {/* Caption, Rating, and Price */}
      <div className="p-4">
        <p className="text-gray-800 mb-2">{post.caption}</p>
        <div className="flex items-center justify-between mb-2">
          <p className="text-yellow-500 font-bold">
            {"⭐".repeat(post.ratings)}
          </p>
          <button className="px-3 py-1 text-sm bg-red-100 text-red-500 rounded-md hover:bg-red-200">
            {post.price} rs
          </button>
        </div>

        {/* Like, Comment, Share Icons */}
        <div className="flex items-center gap-6 text-gray-600 text-xl">
          {/* Like button */}
          <button
            onClick={() => likeOrDislikeHandler(post._id)}
            className="transition cursor-pointer"
          >
            {likes ? <FcLike className="text-2xl" /> : <FiHeart />}
          </button>

          {/* Comment button */}
          <button
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="hover:text-blue-500 transition cursor-pointer"
          >
            <FiMessageCircle />
          </button>

          {/* Share button */}
          <button className="hover:text-green-500 transition cursor-pointer">
            <FiSend />
          </button>
        </div>
        <span className="font-md block my-2">{postLike} likes</span>
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="hover:text-blue-300 cursor-pointer"
          >
            view all {comment.length} comments
          </span>
        )}

        <CommentDialog open={open} setOpen={setOpen} post={post} />
        <div className="flex item-center justify-between">
          <input
            type="text"
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
            value={text}
            onChange={changeEventHandler}
          />
          {text && (
            <span
              onClick={commmentHandler}
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
