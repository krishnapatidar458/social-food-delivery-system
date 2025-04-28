import React from "react";
import {
  Home,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Heart,
} from "lucide-react";

const Leftsidebar = () => {
  return (
    <nav className="flex md:flex-col items-center md:items-start gap-4 w-full border-r-1 h-full  max-sm:border-hidden sm:p-4">
      <SidebarItem icon={<Home />} label="Home" />
      <SidebarItem icon={<Bell />} label="Notifications" />
      <SidebarItem icon={<ShoppingCart />} label="Cart" />

      <SidebarItem icon={<Heart />} label="Favorites" />
      <SidebarItem icon={<MessageCircle />} label="Messages" />
      <SidebarItem icon={<User />} label="Profile" />
    </nav>
  );
};

const SidebarItem = ({ icon, label }) => {
  return (
    <div className="flex items-center justify-center md:justify-start gap-2 p-2 w-full hover:bg-orange-100 rounded-md cursor-pointer transition ">
      <div className="text-gray-700">{icon}</div>
      <span className="text-gray-700 text-sm hidden lg:inline">{label}</span>
    </div>
  );
};

export default Leftsidebar;
