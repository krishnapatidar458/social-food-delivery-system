import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllPost from "../../hooks/useGetAllPost";
import CategoryPosts from "./CategoryPosts";

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {category ? `${category} Posts` : "All Posts"}
      </h2>
      <CategoryPosts posts={posts} category={category} />
    </div>
  );
};

export default CategoryPage;
