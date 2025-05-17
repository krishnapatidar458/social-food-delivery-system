import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CircularProgress, Box, IconButton, Button, Divider } from '@mui/material';
import { ArrowLeft, MessageCircle, Heart } from 'lucide-react';
import PostCard from './PostCard';
import { setSelectedPost } from '../../redux/postSlice';
import CommentDialog from '../comment/CommentDialog';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  
  // Check if post exists in Redux store
  const { posts } = useSelector((store) => store.post);
  const postInRedux = posts.find(p => p._id === id);

  console.log(`Post detail - ID: ${id}, Found in Redux: ${!!postInRedux}`);

  // If post is in Redux, use it immediately
  useEffect(() => {
    if (postInRedux) {
      console.log("Using post from Redux:", postInRedux);
      setPost(postInRedux);
      setLoading(false); // Set loading to false immediately
    }
  }, [postInRedux]);

  // Fetch post data from API regardless of Redux state
  useEffect(() => {
    const fetchPost = async () => {
      if (!id || id.trim() === '') {
        setError('Post ID is missing');
        toast.error('Post ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching post data for ID: ${id}`);
        setLoading(!post); // Only show loading if we don't have the post yet
        
        const response = await axios.get(
          `http://localhost:8000/api/v1/post/${id}`, 
          { withCredentials: true }
        );
        
        console.log("API response:", response.data);
        
        if (response.data.success) {
          if (response.data.post) {
            setPost(response.data.post);
            // Update Redux with the latest post data
            dispatch(setSelectedPost(response.data.post));
          } else {
            setError('Post data is missing');
            toast.error('Post data is missing');
          }
        } else {
          setError(response.data.message || 'Post not found');
          toast.error(response.data.message || 'Post not found');
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        // Extract error message from response if available
        let errorMessage = 'Error fetching post';
        
        if (err.response) {
          // The request was made and the server responded with an error status
          errorMessage = err.response.data?.message || errorMessage;
          console.log(`Server returned error status ${err.response.status}: ${errorMessage}`);
          
          // If it's a "Post not found" or "Invalid post ID" error, display a more user-friendly message
          if (err.response.status === 404 || 
             (err.response.status === 400 && errorMessage.includes('ID'))) {
            errorMessage = 'This post does not exist or has been removed';
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.log('No response received from server');
          errorMessage = 'Unable to connect to server';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setError('Post ID is required');
      setLoading(false);
    }
    
    // Return cleanup function
    return () => {
      // Cleanup
    };
  }, [id, dispatch]);

  const openComments = () => {
    if (post) {
      dispatch(setSelectedPost(post));
      setCommentDialogOpen(true);
    }
  };

  // Debug render state
  console.log("Render state:", { loading, error, hasPost: !!post });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowLeft />
        </IconButton>
        <h1 className="text-xl font-semibold ml-2">Post Details</h1>
      </div>
      
      {loading ? (
        <Box className="flex justify-center py-8">
          <CircularProgress />
        </Box>
      ) : error && !post ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
          <Button 
            variant="text" 
            color="primary" 
            onClick={() => navigate(-1)}
            className="mt-2"
          >
            Go Back
          </Button>
        </div>
      ) : post ? (
        <>
          <PostCard post={post} />
          
          {/* Extra interaction section */}
          <div className="bg-white rounded-xl shadow-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Engagement</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outlined" 
                  startIcon={<Heart size={16} />}
                  color="error"
                >
                  {post.likes?.length || 0} Likes
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<MessageCircle size={16} />}
                  onClick={openComments}
                  color="primary"
                >
                  {post.comments?.length || 0} Comments
                </Button>
              </div>
            </div>
            
            <Divider className="my-3" />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              {post.likes && post.likes.length > 0 ? (
                <p>
                  Liked by {post.likes.length} {post.likes.length === 1 ? 'person' : 'people'}
                </p>
              ) : (
                <p className="text-gray-500">No likes yet</p>
              )}
              
              {post.comments && post.comments.length > 0 ? (
                <div className="mt-2">
                  <p className="cursor-pointer text-blue-500 hover:underline" onClick={openComments}>
                    View all {post.comments.length} comments
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No comments yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 bg-gray-100 rounded-md">
          Post not found
          <Button 
            variant="text" 
            color="primary" 
            onClick={() => navigate(-1)}
            className="mt-2 block"
          >
            Go Back
          </Button>
        </div>
      )}
      
      {/* Comment dialog */}
      {post && (
        <CommentDialog
          open={commentDialogOpen}
          setOpen={setCommentDialogOpen}
          post={post}
        />
      )}
    </div>
  );
};

export default PostDetail; 