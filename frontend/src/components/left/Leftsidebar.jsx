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
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Leftsidebar = () => {
 const [openPost, setOpenPost] = useState(false);
 const navigate=useNavigate();
 const {user}=useSelector(store=>store.auth)

 const createPostHandler = () => {
   setOpenPost(true);
 };
 const sidebarHandler = (textType) => {
   if (textType == "Post") {
     createPostHandler();
   }
   else if(textType=="Profile"){
    navigate(`/profile/${user._id}`);
   }
   else if(textType=="Home"){
    navigate("/");
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
   
  return (
    <>
      <div
        onClick={()=>sidebarHandler(label)}
        className="flex items-center  justify-center md:justify-start gap-2 p-2 w-full hover:bg-orange-100 rounded-md cursor-pointer transition "
      >
        <div className="text-gray-700">{icon}</div>
        <span className="text-gray-700 text-sm hidden lg:inline">{label}</span>
      </div>
      
    </>
  );
};

export default Leftsidebar;
