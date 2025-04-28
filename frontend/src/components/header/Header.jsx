import React from "react";
import { MapPin, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between p-4 md:px-8 bg-white shadow-md gap-4">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlaBUr5bPvUZyj3Dh3afh1CXfuxPW0PWozOw&s"
          alt="Profile"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
        />
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          FOOD HUB
        </h1>
      </div>

      {/* Center Section: Search Bar */}
      <div className="w-full md:w-1/2 relative">
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for food or restaurants..."
          className="w-full pl-12 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm md:text-base"
        />
      </div>

      {/* Right Section: Location and Buttons */}
      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          <span className="text-sm md:text-base">Location</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 text-sm font-semibold text-orange-500 border border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition">
            Login
          </button>
          <button className="px-4 py-1.5 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
