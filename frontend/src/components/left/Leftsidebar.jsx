import React from "react";
import {
  Home,
  MessageCircle,
  Bell,
  ShoppingCart,
  User,
  Heart,
  Send,
} from "lucide-react";

const Leftsidebar = () => {
  return (
    <aside className="flex flex-col p-7 ml-4 gap-6 py-8 px-2 border-r min-h-screen">
      {/* Top Icons */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 p-2 hover:bg-orange-100 cursor-pointer">
          <Home className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">Home</span>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-orange-100 rounded-md cursor-pointer">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">Notification</span>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-orange-100 rounded-md cursor-pointer">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">Cart</span>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-orange-100 rounded-md cursor-pointer">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">Profile</span>
        </div>
      </div>

      {/* Bottom Icons */}
      <div className=" flex flex-col gap-4 ">
        <div className="flex items-center gap-3 p-2 hover:bg-orange-100 rounded-md cursor-pointer">
          <Heart className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">Favorites</span>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-orange-100 rounded-md cursor-pointer">
          <MessageCircle className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 font-medium">Messages</span>
        </div>

        
      </div>
    </aside>
  );
};

export default Leftsidebar;
