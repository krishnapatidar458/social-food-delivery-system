import React from 'react'
import { useParams } from 'react-router-dom';
import Category from './Category'
import Posts from '../post/posts'
import { useSelector } from 'react-redux';
import CategoryPosts from './CategoryPosts';

const CategoryPage = () => {
    
    const params=useParams();
    const category=params.category;
    const { posts } = useSelector((state) => state.post);
  return (
    <main className="flex-1 lg:w-[250px] md:w-[400px] bg-gray-50 p-4 rounded-lg shadow-md">
      <Category />
      <CategoryPosts posts={posts} category={category} />
    </main>
  );
}

export default CategoryPage
