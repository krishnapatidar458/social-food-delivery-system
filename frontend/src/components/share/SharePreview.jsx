import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { Twitter, Facebook, MessageSquare, Send } from 'lucide-react';

const SharePreview = ({ platform, post, message, user }) => {
  // Helper function to truncate text
  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Render different preview based on the platform
  const renderPreview = () => {
    switch (platform) {
      case 'twitter':
        return (
          <Paper className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-start gap-3">
              <Avatar src={user?.profilePicture} alt={user?.username} sx={{ width: 40, height: 40 }} />
              <div className="flex-1">
                <div className="flex items-center">
                  <Typography variant="subtitle2" className="font-bold">{user?.username}</Typography>
                  <Typography variant="caption" className="ml-2 text-gray-500">@{user?.username.toLowerCase().replace(/\s/g, '')}</Typography>
                </div>
                <Typography variant="body2" className="mt-1 mb-3">
                  {message || `Check out this delicious food post: ${truncateText(post?.caption, 80)}`}
                </Typography>
                <Paper className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="bg-gray-100 h-32 flex justify-center items-center">
                    <img 
                      src={post?.image} 
                      alt={post?.caption} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Box className="p-3">
                    <Typography variant="caption" className="text-gray-500">foodapp.com</Typography>
                    <Typography variant="body2" className="font-medium">{truncateText(post?.caption, 60)}</Typography>
                  </Box>
                </Paper>
                <div className="flex items-center gap-6 mt-3 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Twitter size={16} />
                    <Typography variant="caption">Tweet</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        );
      
      case 'facebook':
        return (
          <Paper className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-start gap-3">
              <Avatar src={user?.profilePicture} alt={user?.username} sx={{ width: 40, height: 40 }} />
              <div className="flex-1">
                <Typography variant="subtitle2" className="font-bold">{user?.username}</Typography>
                <Typography variant="caption" className="text-gray-500">Just now · Public</Typography>
                <Typography variant="body2" className="mt-2 mb-3">
                  {message || `Check out this delicious food post!`}
                </Typography>
                <Paper className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="bg-gray-100 h-40 flex justify-center items-center">
                    <img 
                      src={post?.image} 
                      alt={post?.caption} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Box className="p-3">
                    <Typography variant="caption" className="text-gray-500">FOODAPP.COM</Typography>
                    <Typography variant="body2" className="font-medium">{truncateText(post?.caption, 80)}</Typography>
                    <Typography variant="caption" className="text-gray-500 block mt-1">
                      {truncateText(`Delicious food item from ${post?.author?.username}. Rating: ${"⭐".repeat(post?.ratings)}`, 100)}
                    </Typography>
                  </Box>
                </Paper>
                <div className="flex justify-between mt-3 text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>👍</span>
                    <Typography variant="caption">Like</Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <Typography variant="caption">Comment</Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <Send size={16} />
                    <Typography variant="caption">Share</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        );
      
      case 'whatsapp':
        return (
          <Paper className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="bg-[#DCF8C6] p-3 rounded-lg max-w-xs ml-auto">
              <div className="flex flex-col">
                <Typography variant="body2" className="font-medium text-[#075E54]">You</Typography>
                <Typography variant="body2" className="mb-2">
                  {message || `Check out this delicious food post!`}
                </Typography>
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={post?.image} 
                    alt={post?.caption} 
                    className="h-32 w-full object-cover"
                  />
                </div>
                <div className="bg-white p-2 mt-1 rounded-md">
                  <Typography variant="caption" className="text-[#128C7E] block">{truncateText(post?.caption, 50)}</Typography>
                  <Typography variant="caption" className="text-gray-500 block mt-1">
                    Rating: {post?.ratings} ⭐ · Price: ₹{post?.price}
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-500 text-right mt-1">
                  12:34 PM ✓✓
                </Typography>
              </div>
            </div>
          </Paper>
        );
      
      case 'telegram':
        return (
          <Paper className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="bg-[#EBF3FC] p-3 rounded-lg max-w-xs ml-auto">
              <div className="flex flex-col">
                <Typography variant="body2" className="mb-2">
                  {message || `Check out this delicious food post!`}
                </Typography>
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={post?.image} 
                    alt={post?.caption} 
                    className="h-32 w-full object-cover"
                  />
                </div>
                <div className="bg-white p-2 mt-1 rounded-md">
                  <Typography variant="caption" className="text-[#0088cc] block">{truncateText(post?.caption, 60)}</Typography>
                  <Typography variant="caption" className="text-gray-500 block mt-1">
                    foodapp.com
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-500 text-right mt-1">
                  12:34 PM ✓
                </Typography>
              </div>
            </div>
          </Paper>
        );
        
      case 'email':
        return (
          <Paper className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between mb-3">
                <div>
                  <Typography variant="body2"><strong>From:</strong> {user?.username} &lt;{user?.username.toLowerCase().replace(/\s/g, '')}@email.com&gt;</Typography>
                  <Typography variant="body2"><strong>Subject:</strong> Shared Food Post: {truncateText(post?.caption, 40)}</Typography>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Typography variant="body2" className="mb-3">
                  {message || 'Check out this delicious food post!'}
                </Typography>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={post?.image} 
                    alt={post?.caption} 
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3 bg-gray-50">
                    <Typography variant="body2" className="font-medium">{post?.caption}</Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      Rating: {post?.ratings}/5 · Category: {post?.category}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      View this post at: <span className="text-blue-500">https://foodapp.com/posts/{post?._id}</span>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        );
        
      default:
        return (
          <Paper className="p-4 rounded-lg border border-gray-200 bg-white">
            <Box className="text-center py-4">
              <Typography variant="subtitle1">Select a platform to see preview</Typography>
            </Box>
          </Paper>
        );
    }
  };

  return (
    <div className="share-preview">
      <Typography variant="subtitle2" className="mb-2 font-medium">
        Preview
      </Typography>
      {renderPreview()}
    </div>
  );
};

export default SharePreview; 