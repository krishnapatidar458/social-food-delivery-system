import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const [showAll, setShowAll] = useState(false);

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
        {usersToShow.map((user) => (
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
            <button className="text-blue-500 text-xs font-semibold hover:text-blue-700 transition">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
