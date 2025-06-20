import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllPost from "../../hooks/useGetAllPost";
import CategoryPosts from "./CategoryPosts";
<<<<<<< HEAD
import category from "./Category"
import Category from "./Category";
=======
>>>>>>> main

const CategoryPage = () => {
  // Get the category from URL params
  const { category } = useParams();
  
  // Get posts from Redux
  const { posts } = useSelector((state) => state.post);
  
  // Fetch all posts
  useGetAllPost();
  
  if (!posts) {
    return <div className="p-4">Loading posts...</div>;
  }
  
  return (
<<<<<<< HEAD
    <main className="flex-1 lg:w-[250px] md:w-[400px] bg-gray-50 p-4 rounded-lg shadow-md">
      <Category/>
=======
    <div className="p-4">
>>>>>>> main
      <h2 className="text-2xl font-bold mb-4">
        {category ? `${category} Posts` : "All Posts"}
      </h2>
      <CategoryPosts posts={posts} category={category} />
<<<<<<< HEAD
    </main>
=======
    </div>
>>>>>>> main
  );
};

export default CategoryPage;
