import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  Box,
  CircularProgress,
<<<<<<< HEAD
  Skeleton,
  IconButton
} from '@mui/material';
import { History, Check, User, Clock, ExternalLink, Twitter, Facebook, MessageSquare, Mail, Copy, Link2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { QRCodeSVG as QRCode } from 'qrcode.react';

// API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ShareHistory = ({ postId, onClose }) => {
=======
  Skeleton
} from '@mui/material';
import { History, Check, User, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const ShareHistory = ({ postId }) => {
>>>>>>> main
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    const fetchShareHistory = async () => {
      if (!postId) {
        setError('Post ID is required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/share/history/${postId}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setHistory(response.data.history || []);
        } else {
          setError(response.data.message || 'Failed to load share history');
        }
      } catch (err) {
        console.error('Error fetching share history:', err);
        setError('Error loading share history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShareHistory();
  }, [postId]);

=======
    if (postId) {
      fetchShareHistory();
    }
  }, [postId]);

  const fetchShareHistory = async () => {
    try {
      setLoading(true);
      
      // This would be a real API call in production
      const res = await axios.get(
        `http://localhost:8000/api/v1/share/my-shares`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        // Filter only shares related to this post
        const postShares = res.data.shares.filter(share => share.post._id === postId);
        setHistory(postShares);
      }
    } catch (error) {
      console.error('Error fetching share history:', error);
      setError('Could not load share history');
    } finally {
      setLoading(false);
    }
  };

>>>>>>> main
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'viewed':
        return 'primary';
      case 'expired':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const getShareTypeLabel = (shareType) => {
    switch (shareType) {
      case 'followers':
        return 'Shared with followers';
      case 'specific':
        return 'Shared with specific users';
      case 'external':
        return 'Shared externally';
      case 'public':
      default:
        return 'Shared publicly';
    }
  };

  const getPlatformName = (platform) => {
    if (!platform) return null;
    
    const platforms = {
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'twitter': 'Twitter',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'email': 'Email',
      'sms': 'SMS',
      'copy': 'Copied Link'
    };
    
    return platforms[platform] || platform;
  };

<<<<<<< HEAD
  // Helper function to get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <Twitter size={16} className="text-[#1DA1F2]" />;
      case 'facebook':
        return <Facebook size={16} className="text-[#4267B2]" />;
      case 'whatsapp':
        return <MessageSquare size={16} className="text-[#25D366]" />;
      case 'telegram':
        return <MessageSquare size={16} className="text-[#0088cc]" />;
      case 'email':
        return <Mail size={16} className="text-[#EA4335]" />;
      case 'copy':
        return <Copy size={16} className="text-gray-700" />;
      default:
        return <Link2 size={16} className="text-gray-700" />;
    }
  };
  
  // Helper function to get share type badge
  const getShareTypeBadge = (type) => {
    switch (type) {
      case 'specific':
        return (
          <Chip 
            size="small" 
            icon={<User size={14} />} 
            label="Specific Users" 
            variant="outlined" 
            className="text-xs" 
            color="info"
          />
        );
      case 'followers':
        return (
          <Chip 
            size="small" 
            icon={<User size={14} />} 
            label="Followers" 
            variant="outlined" 
            className="text-xs" 
            color="secondary"
          />
        );
      case 'external':
        return (
          <Chip 
            size="small" 
            icon={<Link2 size={14} />} 
            label="External" 
            variant="outlined" 
            className="text-xs" 
            color="warning"
          />
        );
      case 'public':
        return (
          <Chip 
            size="small" 
            icon={<Link2 size={14} />} 
            label="Public" 
            variant="outlined" 
            className="text-xs" 
            color="success"
          />
        );
      default:
        return (
          <Chip 
            size="small" 
            icon={<Link2 size={14} />} 
            label="Direct" 
            variant="outlined" 
            className="text-xs" 
            color="default"
          />
        );
    }
  };

  // Handle empty state  
  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Clock size={40} className="text-gray-300 mx-auto mb-2" />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        No Share History
      </Typography>
      <Typography variant="body2" color="textSecondary">
        When this post is shared, the history will appear here.
      </Typography>
    </Box>
  );
  
  // Render error state
  const renderError = () => (
    <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
      <Link2 size={40} className="mx-auto mb-2" />
      <Typography variant="h6" gutterBottom>
        Error Loading History
      </Typography>
      <Typography variant="body2">
        {error}
      </Typography>
    </Box>
  );
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Loading state
=======
>>>>>>> main
  if (loading) {
    return (
      <Paper className="p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <History size={20} className="mr-2 text-orange-500" />
          <Typography variant="subtitle1" className="font-medium">Recent Share Activity</Typography>
        </div>
        <List>
          {[1, 2, 3].map((item) => (
            <ListItem key={item} alignItems="flex-start">
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton width="60%" />}
                secondary={
                  <>
                    <Skeleton width="40%" />
                    <Skeleton width="30%" />
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

<<<<<<< HEAD
  // Error state
  if (error) {
    return renderError();
  }

  // Empty state
  if (!history || history.length === 0) {
    return renderEmptyState();
=======
  if (error) {
    return (
      <Paper className="p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <History size={20} className="mr-2 text-orange-500" />
          <Typography variant="subtitle1" className="font-medium">Recent Share Activity</Typography>
        </div>
        <Typography color="error" align="center" className="py-4">
          {error}
        </Typography>
      </Paper>
    );
>>>>>>> main
  }

  return (
    <Paper className="p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <History size={20} className="mr-2 text-orange-500" />
          <Typography variant="subtitle1" className="font-medium">Recent Share Activity</Typography>
        </div>
<<<<<<< HEAD
        <div className="flex items-center">
          <Chip 
            label={`${history.length} shares`} 
            size="small" 
            color="primary" 
            variant="outlined"
            className="mr-2"
          />
          {onClose && (
            <IconButton 
              size="small" 
              onClick={handleClose}
              aria-label="Close history"
            >
              <X size={16} />
            </IconButton>
          )}
        </div>
      </div>

      <List disablePadding className="max-h-80 overflow-auto">
        {history.map((item, index) => (
          <React.Fragment key={item._id || index}>
            <ListItem alignItems="flex-start" className="share-history-item">
              <ListItemAvatar>
                <Avatar src={item.sharedBy?.profilePicture}>
                  {item.sharedBy?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography component="span" variant="body2" fontWeight="medium">
                      {item.sharedBy?.username || 'Anonymous'}
                    </Typography>
                    {getShareTypeBadge(item.sharedWith)}
                    {item.externalPlatform && (
                      <Chip 
                        size="small" 
                        icon={getPlatformIcon(item.externalPlatform)} 
                        label={item.externalPlatform.charAt(0).toUpperCase() + item.externalPlatform.slice(1)} 
                        variant="outlined" 
                        className="text-xs"
                      />
                    )}
                    {item.status === 'viewed' && (
                      <Chip 
                        size="small" 
                        icon={<Check size={14} />} 
                        label="Viewed" 
                        variant="outlined" 
                        className="text-xs" 
                        color="success"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="caption" color="textSecondary" display="block">
                      {formatDate(item.createdAt)}
                    </Typography>
                    {item.message && (
                      <Typography component="span" variant="body2" color="textPrimary" className="mt-1 block">
                        "{item.message}"
                      </Typography>
                    )}
                    {item.recipients && item.recipients.length > 0 && (
                      <Typography component="span" variant="caption" color="textSecondary" className="mt-1 block">
                        Shared with {item.recipients.length} users
                      </Typography>
                    )}
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < history.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
=======
        <Chip 
          label={`${history.length} shares`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </div>

      {history.length > 0 ? (
        <List disablePadding className="max-h-80 overflow-auto">
          {history.map((share, index) => (
            <React.Fragment key={share._id}>
              <ListItem alignItems="flex-start" className="py-2">
                <ListItemAvatar>
                  <Avatar alt={share.sharedBy?.username} src={share.sharedBy?.profilePicture}>
                    {share.sharedBy?.username?.[0] || 'U'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div className="flex flex-wrap items-center gap-2">
                      <Typography variant="body2" className="font-medium">
                        {getShareTypeLabel(share.sharedWith)}
                      </Typography>
                      <Chip 
                        label={share.status} 
                        size="small"
                        color={getStatusColor(share.status)}
                        variant="outlined"
                        className="h-5"
                      />
                    </div>
                  }
                  secondary={
                    <>
                      <div className="mt-1">
                        {share.externalPlatform && (
                          <Chip
                            label={getPlatformName(share.externalPlatform)}
                            size="small"
                            className="mr-2 mb-1"
                            color="default"
                            variant="outlined"
                          />
                        )}
                        {share.message && (
                          <Typography variant="body2" color="textSecondary" className="mt-1 italic">
                            "{share.message}"
                          </Typography>
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {formatDistanceToNow(new Date(share.createdAt), { addSuffix: true })}
                        
                        {share.recipients && share.recipients.length > 0 && (
                          <span className="ml-3 flex items-center">
                            <User size={12} className="mr-1" />
                            {share.recipients.length} recipient{share.recipients.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        
                        {share.shareLink && (
                          <span className="ml-3 flex items-center">
                            <ExternalLink size={12} className="mr-1" />
                            <a 
                              href={share.shareLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View link
                            </a>
                          </span>
                        )}
                      </div>
                    </>
                  }
                />
              </ListItem>
              {index < history.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box className="text-center py-6">
          <Typography variant="body2" color="textSecondary">
            No share history available for this post yet.
          </Typography>
        </Box>
      )}
>>>>>>> main
    </Paper>
  );
};

export default ShareHistory; 