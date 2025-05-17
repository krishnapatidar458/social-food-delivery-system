import React from 'react'
import Category from '../category/Category'
import useGetAllPost from '../../hooks/useGetAllPost';
import Posts from '../post/posts'
import { useSelector } from 'react-redux';

const Feeds = () => {
  const { posts } = useSelector((state) => state.post);
  
  useGetAllPost();
  return (
    <>
      <main className="flex-1 lg:w-[250px] md:w-[400px] bg-gray-50 p-4 rounded-lg shadow-md">
        <Category />
        <Posts posts={posts} />
      </main>
    </>
  );
}

export default Feeds
