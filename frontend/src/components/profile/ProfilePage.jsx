import { Avatar, Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { Heart, MessageCircle } from "lucide-react";
import { followOrUnfollow } from "../../redux/userSlice";

const ProfilePage = ({ userProfile }) => {
  const [reload, setReload] = useState(false);
  const { id: userId } = useParams();
  const navigate = useNavigate();
  useGetUserProfile(userId );
  const [activeTab, setActiveTab] = useState("posts");
  const { user } = useSelector((store) => store.auth);
   // trigger refetch

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const displayedShorts =
    activeTab === "shorts"
      ? userProfile?.shorts?.filter(
          (short) => short.author?._id === userProfile?._id
        )
      : [];

  const tabs = ["posts", "saved", "tags"];

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading Profile...</p>
      </div>
    );
  }

  const dispatch = useDispatch();
  const { followings, loading } = useSelector((store) => store.user);

  const isFollowing = followings.includes(userProfile?._id);

  const handleFollowClick = () => {
    
    dispatch(followOrUnfollow(userProfile?._id));
    
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto p-4 sm:p-8">
      <div className="flex flex-col gap-10 w-full">
        {/* Top Profile Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <section className="flex justify-center">
            <img
              alt={userProfile?.username}
              src={userProfile?.profilePicture || "/default-avatar.png"}
              className="w-32 h-32 sm:w-40 sm:h-40 border rounded-full object-cover"
            />
          </section>

          <section className="flex flex-col gap-3">
            <span className="font-bold">{userProfile?.username}</span>
            <div className="flex flex-wrap items-center gap-3 text-lg font-medium">
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/profile/:id/account/edit">
                    <Button
                      variant="contained"
                      color="primary"
                      className=" sm:w-auto mb-3"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    className=" sm:w-auto mb-3"
                  >
                    View Archive
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className=" sm:w-auto mb-3"
                  >
                    Ad Tools
                  </Button>
                </>
              ) : isFollowing ? (
                <>
                  <Button
                    onClick={handleFollowClick}
                    disabled={loading}
                    variant="contained"
                    color="secondaty"
                    className=" sm:w-auto mb-3"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className=" sm:w-auto mb-3"
                  >
                    Message
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleFollowClick}
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  className=" sm:w-auto mb-3"
                >
                  Follow
                </Button>
              )}
            </div>

            <div className="flex gap-6 text-sm">
              <p>
                <strong>{userProfile?.posts?.length}</strong> posts
              </p>
              <p>
                <strong>{userProfile?.followers?.length}</strong> followers
              </p>
              <p>
                <strong>{userProfile?.followings?.length}</strong> followings
              </p>
            </div>

            <p className="text-sm">{userProfile?.bio || "No bio provided."}</p>
          </section>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-300">
          <div className="flex justify-center gap-8 text-sm font-semibold text-gray-600">
            {tabs.map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer py-3 ${
                  activeTab === tab ? "border-b-2 border-black text-black" : ""
                }`}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Posts/Shorts Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(activeTab === "posts" || activeTab === "saved") &&
            displayedPost?.map((post) => (
              <div key={post._id} className="relative group cursor-pointer">
                {post.mediaType === "image" ? (
                  <img
                    src={post.image || "/placeholder.jpg"}
                    alt="Post"
                    className="rounded-sm w-full aspect-square object-cover"
                  />
                ) : (
                  <video
                    src={post.video}
                    autoPlay
                    muted
                    loop
                    className="rounded-sm w-full aspect-square object-cover"
                  />
                )}

                {/* Hover Icons */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="flex gap-6 text-white text-sm">
                    <span className="flex items-center gap-1">
                      <Heart size={16} />
                      {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {activeTab === "shorts" &&
            displayedShorts?.map((short) => (
              <div
                key={short._id}
                className="relative group cursor-pointer overflow-hidden"
              >
                <video
                  src={short.mediaUrl}
                  controls
                  loop
                  muted
                  className="rounded-sm w-full aspect-square object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
