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
  Skeleton
} from '@mui/material';
import { History, Check, User, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const ShareHistory = ({ postId }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }

  return (
    <Paper className="p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <History size={20} className="mr-2 text-orange-500" />
          <Typography variant="subtitle1" className="font-medium">Recent Share Activity</Typography>
        </div>
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
    </Paper>
  );
};

export default ShareHistory; 