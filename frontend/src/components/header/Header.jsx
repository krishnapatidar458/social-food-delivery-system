import React from "react";
import { MapPin, Search } from "lucide-react";
import { Avatar } from "@mui/material";

const Header = () => {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between p-4 shadow-md bg-white gap-4">
      {/* Top / Left Section: Profile + Heading */}
      <div className="flex items-center gap-3">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlaBUr5bPvUZyj3Dh3afh1CXfuxPW0PWozOw&s"
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold text-gray-800">FOOD HUB</h1>
      </div>

      {/* Center Section: Search Bar */}
      <div className="w-full md:w-1/2 relative">
        <Search className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for food or restaurants..."
          className="w-full p-2 pl-12 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Bottom / Right Section: Location + Login/Signup */}
      <div className="flex items-center gap-4">
        <div className="flex  justify-between gap-3">
          <div>
            <MapPin className="w-6 h-6 text-gray-600" />
          </div>
          <div>Location</div>
        </div>

        <button className="px-4 py-2 text-sm font-semibold text-orange-500 border border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition">
          Login
        </button>
        <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition">
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
