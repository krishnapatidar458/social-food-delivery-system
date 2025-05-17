import React, { useState } from "react";
import {
  Home,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Heart,
  PlusSquare,
} from "lucide-react";
import CreatePost from "../post/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // npm install moment
import { clearNotifications, markNotificationsSeen } from "../../redux/rtnSlice";

import { Avatar, Badge, Popover, Typography } from "@mui/material";


const Leftsidebar = () => {
  const [openPost, setOpenPost] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
 

  const createPostHandler = () => {
    setOpenPost(true);
  };
  const sidebarHandler = (textType) => {
    if (textType == "Post") {
      createPostHandler();
    } else if (textType == "Profile") {
      navigate(`/profile/${user._id}`);
    } else if (textType == "Home") {
      navigate("/");
    } else if (textType == "Messages") {
      navigate("/chat/chatpage");
    }
  };

  return (
    <nav className="flex md:flex-col relative items-center md:items-start gap-4 w-full border-r-1 h-full  max-sm:border-hidden sm:p-4">
      <SidebarItem
        icon={<Home />}
        label="Home"
        sidebarHandler={sidebarHandler}
      />
      <SidebarItem
        icon={<Bell />}
        label="Notifications"
        sidebarHandler={sidebarHandler}
      />

      <SidebarItem
        icon={<PlusSquare />}
        label="Post"
        sidebarHandler={sidebarHandler}
      />

      <SidebarItem
        icon={<Heart />}
        label="Favorites"
        sidebarHandler={sidebarHandler}
      />
      <SidebarItem
        icon={<MessageCircle />}
        label="Messages"
        sidebarHandler={sidebarHandler}
      />
      <SidebarItem
        icon={<User />}
        label="Profile"
        sidebarHandler={sidebarHandler}
      />
      <CreatePost open={openPost} setOpen={setOpenPost} />
    </nav>
  );
};

const SidebarItem = ({ icon, label, sidebarHandler }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unseenCount = likeNotification.filter((n) => !n.seen).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (unseenCount > 0) {
      dispatch(markNotificationsSeen()); // Mark as seen when popover opens
    }
  };

  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = (postId) => {
    navigate(`/post/${postId}`);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div
      onClick={() => label !== "Notifications" && sidebarHandler(label)}
      className="flex items-center justify-center md:justify-start gap-2 p-2 w-full hover:bg-orange-100 rounded-md cursor-pointer transition"
    >
      {label === "Notifications" ? (
        <>
          <Badge
            badgeContent={unseenCount > 0 ? unseenCount : null}
            color="secondary"
            onClick={handleClick}
          >
            <div className="text-gray-700">{icon}</div>
          </Badge>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <div className="max-h-[300px] w-[300px] overflow-y-auto p-2">
              {likeNotification.length === 0 ? (
                <p className="p-4 text-sm text-gray-600">
                  No new notifications
                </p>
              ) : (
                likeNotification.map((notification, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      handleNotificationClick(notification?.postId)
                    }
                  >
                    <Avatar
                      alt={notification.userDetails?.username}
                      src={notification.userDetails?.profilePicture}
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-bold">
                          {notification.userDetails?.username}
                        </span>{" "}
                        liked your post
                      </p>
                      <p className="text-xs text-gray-500">
                        {moment(notification?.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Popover>

          <span className="text-gray-700 text-sm hidden lg:inline">
            {label}
          </span>
        </>
      ) : (
        <>
          <div className="text-gray-700">{icon}</div>
          <span className="text-gray-700 text-sm hidden lg:inline">
            {label}
          </span>
        </>
      )}
    </div>
  );
};

export default Leftsidebar;
