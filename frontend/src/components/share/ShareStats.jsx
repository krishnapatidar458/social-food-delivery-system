import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { BarChart2, Share2, Users, Globe, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const ShareStats = ({ postId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId) {
      fetchShareStats();
    }
  }, [postId]);

  const fetchShareStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/share/stats/${postId}`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Error fetching share stats:', error);
      setError('Could not load share statistics');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformName = (platform) => {
    if (!platform) return 'Direct/Link';
    
    const platforms = {
      'whatsapp': 'WhatsApp',
      'telegram': 'Telegram',
      'twitter': 'Twitter',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'email': 'Email',
      'sms': 'SMS',
      'copy': 'Link Copy'
    };
    
    return platforms[platform] || platform;
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'whatsapp':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99602 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07049 10.5335 4.06776 11.9246C4.06639 13.3158 4.43033 14.6832 5.126 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8891 11.99 19.9C14.0997 19.9001 16.124 19.0668 17.6222 17.5816C19.1205 16.0965 19.9715 14.0796 19.99 11.97C19.983 10.9173 19.7682 9.87634 19.3581 8.9068C18.948 7.93725 18.3505 7.05819 17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.429 5.51762 10.8372C5.7935 9.24545 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37468C13.9853 5.4617 15.511 6.13426 16.66 7.26999C17.916 8.49818 18.635 10.1735 18.66 11.93C18.6442 13.6859 17.9355 15.3645 16.6882 16.6006C15.441 17.8366 13.756 18.5301 12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.6681 10.3359 10.6827 10.2759 10.6827 10.215C10.6827 10.1541 10.6681 10.0941 10.64 10.04C10.64 9.93999 10.19 8.95999 10.03 8.56999C9.87 8.17999 9.71 8.23999 9.59 8.22999H9.19C9.08895 8.23154 8.9894 8.25465 8.898 8.29776C8.8066 8.34087 8.72546 8.403 8.66 8.47999C8.43562 8.70318 8.26061 8.97261 8.14676 9.27046C8.03291 9.56831 7.98287 9.88797 8 10.21C8.0627 10.9277 8.34443 11.6078 8.81 12.17C9.6495 13.3638 10.7952 14.3054 12.1296 14.8886C12.8024 15.1722 13.5522 15.2915 14.29 15.235C14.677 15.1983 15.0508 15.0714 15.3825 14.8658C15.7141 14.6602 15.9954 14.3812 16.2 14.05C16.43 13.61 16.5 13.24 16.44 12.92C16.38 12.8 16.25 12.75 16.06 12.65L15.61 13.59Z" fill="#4ECB5C"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4287 14.0003 10.3658 13.9807 10.3078C13.9611 10.2498 13.9291 10.1989 13.8875 10.1595C13.8459 10.12 13.7962 10.0933 13.7437 10.0824C13.6911 10.0715 13.637 10.0767 13.587 10.098C13.517 10.098 13.087 10.398 12.297 10.998C12.037 11.183 11.817 11.293 11.617 11.273C11.437 11.253 11.077 11.153 10.797 11.053C10.447 10.933 10.167 10.873 10.197 10.673C10.227 10.573 10.347 10.473 10.577 10.363C11.697 9.66302 12.527 9.20302 13.047 8.98302C14.697 8.23302 15.009 8.13302 15.216 8.13302C15.2475 8.13136 15.279 8.13653 15.309 8.14827C15.339 8.16001 15.3672 8.17809 15.392 8.20153C15.4168 8.22496 15.4378 8.25333 15.4538 8.28495C15.4698 8.31657 15.4805 8.35082 15.485 8.38602C15.515 8.51302 15.64 8.8 15.64 8.8H16.64Z" fill="#0088cc"/>
          </svg>
        );
      case 'twitter':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.633 7.99704C19.646 8.17204 19.646 8.34604 19.646 8.52004C19.646 13.845 15.593 19.981 8.186 19.981C5.904 19.981 3.784 19.32 2 18.172C2.324 18.209 2.636 18.222 2.973 18.222C4.856 18.222 6.589 17.586 7.974 16.501C6.203 16.464 4.722 15.306 4.207 13.708C4.456 13.745 4.706 13.77 4.968 13.77C5.329 13.77 5.692 13.72 6.029 13.633C4.182 13.259 2.799 11.638 2.799 9.68004V9.63004C3.336 9.92904 3.959 10.116 4.619 10.141C3.534 9.41904 2.823 8.18404 2.823 6.78704C2.823 6.03904 3.022 5.35304 3.371 4.75504C5.354 7.19804 8.335 8.79504 11.677 8.97004C11.615 8.67004 11.577 8.35904 11.577 8.04704C11.577 5.82704 13.373 4.01904 15.605 4.01904C16.765 4.01904 17.812 4.50504 18.548 5.29104C19.458 5.11604 20.33 4.77904 21.104 4.31804C20.805 5.25304 20.168 6.03904 19.333 6.53804C20.144 6.45004 20.93 6.22604 21.652 5.91404C21.104 6.71204 20.419 7.42304 19.633 7.99704Z" fill="#1DA1F2"/>
        </svg>;
      case 'facebook':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.9 2H3.1C2.49 2 2 2.49 2 3.1V20.9C2 21.51 2.49 22 3.1 22H12.72V14.25H10.08V11.11H12.72V8.77C12.72 6.11 14.23 4.77 16.57 4.77C17.7 4.77 18.67 4.85 18.95 4.89V7.67H17.39C16.16 7.67 15.92 8.26 15.92 9.11V11.11H18.85L18.44 14.25H15.92V22H20.9C21.51 22 22 21.51 22 20.9V3.1C22 2.49 21.51 2 20.9 2Z" fill="#4267B2"/>
        </svg>;
      case 'email':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#BB001B"/>
        </svg>;
      case 'sms':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="#7D3AC1"/>
        </svg>;
      case 'copy':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="#333333"/>
        </svg>;
      default:
        return <Share2 size={20} />;
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center py-4">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper className="p-4 rounded-lg text-center">
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper className="p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <BarChart2 size={20} className="mr-2 text-orange-500" />
        <Typography variant="subtitle1" className="font-medium">Share Analytics</Typography>
      </div>
      
      {stats ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <Typography variant="h4" className="font-bold text-orange-500">
                {stats.totalShares}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Total Shares
              </Typography>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <Typography variant="h4" className="font-bold text-blue-500">
                {stats.platformStats?.length || 0}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Platforms
              </Typography>
            </div>
          </div>
          
          <Divider className="my-3" />
          
          <Typography variant="subtitle2" className="mb-2">
            Shares by Platform
          </Typography>
          
          {stats.platformStats && stats.platformStats.length > 0 ? (
            <List dense className="mb-2">
              {stats.platformStats.map((stat, index) => (
                <ListItem key={index} className="px-0 py-1">
                  <ListItemIcon className="min-w-0 mr-2">
                    {getPlatformIcon(stat._id)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={getPlatformName(stat._id)} 
                    secondary={`${stat.count} shares`}
                  />
                  <div className="flex items-center">
                    <div 
                      className="bg-orange-100 rounded-full h-1.5"
                      style={{ 
                        width: `${Math.max(20, (stat.count / stats.totalShares) * 100)}px`
                      }}
                    />
                    <Typography variant="caption" className="ml-2 text-gray-500">
                      {((stat.count / stats.totalShares) * 100).toFixed(1)}%
                    </Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" className="text-gray-500 text-center py-2">
              No platform data available
            </Typography>
          )}
          
          <Box className="mt-3 text-right">
            <Typography variant="caption" className="text-gray-500 italic">
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography variant="body2" className="text-center py-4">
          No share data available yet
        </Typography>
      )}
    </Paper>
  );
};

export default ShareStats; 