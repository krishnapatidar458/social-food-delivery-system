import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { followOrUnfollow } from "../../redux/userSlice";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const { followings, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [processingUserId, setProcessingUserId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleFollowClick = async (userId) => {
    setProcessingUserId(userId);
    dispatch(followOrUnfollow(userId));
    setProcessingUserId(null);
  };

  const usersToShow = showAll ? suggestedUsers : suggestedUsers.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm text-gray-700">
          Suggested for you
        </h2>
        {!showAll && suggestedUsers.length > 4 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-500 text-xs font-medium hover:underline"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-2">
        {usersToShow.map((user) => {
          const isFollowing = followings.includes(user._id);
          const isProcessing = processingUserId === user._id;

          return (
            <div
              key={user._id}
              className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-md transition"
            >
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user._id}`}>
                  <Avatar
                    alt={user.username}
                    src={user.profilePicture}
                    className="w-9 h-9"
                  />
                </Link>
                <div className="text-sm">
                  <Link to={`/profile/${user._id}`}>
                    <p className="font-medium text-gray-800">{user.username}</p>
                  </Link>
                  <p className="text-xs text-gray-500 truncate w-36">
                    {user.bio || "No bio"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFollowClick(user._id)}
                disabled={isProcessing}
                className={`px-4 py-1 rounded-full text-sm font-medium transition duration-200 ${
                  isFollowing
                    ? "bg-gray-300 text-black hover:bg-gray-400"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isProcessing
                  ? "..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
