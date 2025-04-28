import React, { useState, useEffect, useRef } from "react";
import { FiHeart, FiMessageCircle, FiSend } from "react-icons/fi"; // Outline Icons
import { FcLike } from "react-icons/fc"; // Filled Heart Icon

const PostCard = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false); // Updated: State for liked/unliked
  const optionsRef = useRef();

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
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
  const handleLikeClick = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-6 max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.userProfile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{post.username}</h4>
            <p className="text-sm text-gray-500">
              {post.location} • {post.distance} km
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={handleToggleOptions}
            className="text-gray-600 hover:text-gray-900 transition text-2xl"
          >
            ⋮
          </button>

          {/* Options Dialog */}
          {showOptions && (
            <div
              ref={optionsRef}
              className="absolute top-10 right-0 bg-white shadow-md rounded-md w-40 py-2 z-20"
            >
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                Share
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                Add to Favorite
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Image or Video */}
      <div className="w-full h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
        {post.type === "video" ? (
          <video
            src={post.media}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.media}
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
            {"⭐".repeat(post.rating)}
          </p>
          <button className="px-3 py-1 text-sm bg-red-100 text-red-500 rounded-md hover:bg-red-200">
            {post.price} rs
          </button>
        </div>

        {/* Like, Comment, Share Icons */}
        <div className="flex items-center gap-6 text-gray-600 text-xl">
          {/* Like button */}
          <button onClick={handleLikeClick} className="transition">
            {liked ? <FcLike className="text-2xl" /> : <FiHeart />}
          </button>

          {/* Comment button */}
          <button className="hover:text-blue-500 transition">
            <FiMessageCircle />
          </button>

          {/* Share button */}
          <button className="hover:text-green-500 transition">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
