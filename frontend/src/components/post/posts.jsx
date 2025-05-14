import React from 'react'
import PostCard from './PostCard'

const posts = ({posts, category}) => {
  console.log(posts)
  return (
    <div>
      {posts.filter((post)=>{return }).map((post) => {
        return <PostCard key={post._id} post={post} />;
      })}
    </div>
  );
}

export default posts
