import React from "react";

import Header from "./components/header/Header";
import Leftsidebar from "./components/left/Leftsidebar";
import RightSideBar from "./components/right/RightSideBar";
import Category from "./components/category/Category";
import PostCard from "./components/Posts/PostCard";




const samplePost = {
  userProfile: "https://randomuser.me/api/portraits/men/41.jpg",
  username: "John Doe",
  location: "Los Angeles",
  distance: 3.7,
  type: "image", // or "video"
  media:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=60",
  caption: "Exploring new heights! 🏔️",
  rating: 5,
  price: 499,
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
        {/* Left Sidebar sticky on md+ */}
        <aside className="hidden md:flex md:flex-col md:w-20 lg:w-64">
          <Leftsidebar />
        </aside>

        {/* Center Content */}
        <main className="flex-1 lg:w-[250px] md:w-[400px] bg-gray-50 p-4 rounded-lg shadow-md">
          <Category />
          <PostCard post={samplePost} />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:w-[300px] mr-5">
          <RightSideBar />
        </aside>
      </div>

      {/* Left Sidebar fixed at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 block md:hidden p-2 shadow-t bg-white border-t">
        <Leftsidebar />
      </div>
    </div>
  );
};

export default App;
