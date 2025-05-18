import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
  Chip,
  Fade,
  Slide,
  Grow,
  Grid
} from '@mui/material';
import { useSelector } from 'react-redux';
import { 
  Search, 
  Users, 
  Globe, 
  Copy, 
  Check, 
  X, 
  Link as LinkIcon, 
  Twitter, 
  Facebook, 
  Instagram,
  Send,
  Mail,
  MessageSquare,
  Share2,
  Clock,
  BarChart2,
  Eye,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './share.css';

// Import custom components
import SharePreview from './SharePreview';
import ShareStats from './ShareStats';
import ScheduledShare from './ScheduledShare';
import ShareHistory from './ShareHistory';

// Tab panel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`share-tabpanel-${index}`}
      aria-labelledby={`share-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box sx={{ p: 2 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
};

const ShareDialog = ({ open, onClose, post, onShareSuccess }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState('');
  
  const { user } = useSelector((store) => store.auth);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
      setShareSuccess(false);
      setShareLink('');
      setMessage('');
      setSelectedUsers([]);
      setPreviewPlatform('');
    }
  }, [open]);
  
  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:8000/api/v1/user/suggested-users',
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setUsers(res.data.suggestedUser || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter users based on search query
  const filteredUsers = searchQuery.trim() 
    ? users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle sub-tab change
  const handleSubTabChange = (subtab) => {
    setActiveSubTab(subtab);
  };
  
  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  // Handle share with selected users
  const handleShareWithUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user');
      return;
    }
    
    try {
      setShareLoading(true);
      
      const res = await axios.post(
        'http://localhost:8000/api/v1/share/create',
        {
          postId: post._id,
          sharedWith: 'specific',
          recipients: selectedUsers,
          message: message,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        setShareSuccess(true);
        setShareLink(res.data.shareLink);
        
        // Call onShareSuccess handler if provided
        if (onShareSuccess) {
          onShareSuccess();
        }
        
        // Clear form
        setMessage('');
        setSelectedUsers([]);
        
        // Show success toast
        toast.success('Post shared successfully!');
        
        // Close dialog after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error(error?.response?.data?.message || 'Error sharing post');
    } finally {
      setShareLoading(false);
    }
  };
  
  // Handle share with followers
  const handleShareWithFollowers = async () => {
    try {
      setShareLoading(true);
      
      const res = await axios.post(
        'http://localhost:8000/api/v1/share/create',
        {
          postId: post._id,
          sharedWith: 'followers',
          message: message,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        setShareSuccess(true);
        setShareLink(res.data.shareLink);
        
        // Call onShareSuccess handler if provided
        if (onShareSuccess) {
          onShareSuccess();
        }
        
        // Clear form
        setMessage('');
        
        // Show success toast
        toast.success('Post shared with your followers!');
        
        // Close dialog after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error sharing post with followers:', error);
      toast.error(error?.response?.data?.message || 'Error sharing post');
    } finally {
      setShareLoading(false);
    }
  };
  
  // Handle share via external platform
  const handleExternalShare = async (platform) => {
    try {
      setShareLoading(true);
      
      // First create a share record
      const res = await axios.post(
        'http://localhost:8000/api/v1/share/create',
        {
          postId: post._id,
          sharedWith: 'external',
          externalPlatform: platform,
          message: message,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        // Get the share link
        const shareUrl = res.data.shareLink;
        setShareLink(shareUrl);
        
        // Call onShareSuccess handler if provided
        if (onShareSuccess) {
          onShareSuccess();
        }
        
        // Construct platform-specific share links
        let externalUrl = '';
        
        switch (platform) {
          case 'twitter':
            externalUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message || `Check out this food post: ${post.caption}`)}`;
            break;
          case 'facebook':
            externalUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
          case 'whatsapp':
            externalUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${message || post.caption} ${shareUrl}`)}`;
            break;
          case 'telegram':
            externalUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message || post.caption)}`;
            break;
          case 'email':
            externalUrl = `mailto:?subject=${encodeURIComponent(`Shared Food Post: ${post.caption}`)}&body=${encodeURIComponent(`${message || 'Check out this delicious food post!'}\n\n${shareUrl}`)}`;
            break;
          case 'copy':
            navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
            break;
          default:
            break;
        }
        
        // Open external url if not copy
        if (platform !== 'copy' && externalUrl) {
          window.open(externalUrl, '_blank');
        }
        
        setShareSuccess(true);
        
        // Close dialog after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error(`Error sharing via ${platform}:`, error);
      toast.error(`Error sharing via ${platform}`);
    } finally {
      setShareLoading(false);
    }
  };
  
  // Copy share link to clipboard
  const handleCopyLink = async () => {
    if (!shareLink) {
      try {
        const res = await axios.post(
          'http://localhost:8000/api/v1/share/create',
          {
            postId: post._id,
            sharedWith: 'public',
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        
        if (res.data.success) {
          setShareLink(res.data.shareLink);
          navigator.clipboard.writeText(res.data.shareLink);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
          
          // Call onShareSuccess handler if provided
          if (onShareSuccess) {
            onShareSuccess();
          }
        }
      } catch (error) {
        console.error('Error generating share link:', error);
        toast.error('Error generating share link');
      }
    } else {
      navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };
  
  // Handle scheduled share
  const handleScheduledShare = (scheduleData) => {
    // In a real implementation, this would send the schedule data to the server
    console.log("Scheduled share data:", scheduleData);
    
    // Show success message
    toast.success('Share scheduled successfully!');
    
    // Call onShareSuccess handler if provided
    if (onShareSuccess) {
      onShareSuccess();
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className="share-dialog"
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
    >
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6" component="div" className="font-medium">
          Share Post
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <X size={18} />
        </IconButton>
      </DialogTitle>
      
      {/* Post preview */}
      <Box className="px-6 py-2 flex items-center gap-3 bg-gray-50">
        <img 
          src={post?.image} 
          alt={post?.caption} 
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="flex-1 min-w-0">
          <Typography variant="subtitle2" noWrap>
            {post?.caption}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            by {post?.author?.username}
          </Typography>
        </div>
      </Box>
      
      <Divider />
      
      {shareSuccess ? (
        <DialogContent>
          <div className="text-center py-4">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4 success-icon">
                <Check size={32} />
              </div>
              <Typography variant="h6" gutterBottom>
                Post Shared Successfully!
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Your post has been shared.
              </Typography>
            </div>
            
            {shareLink && (
              <div className="mt-4">
                <Typography variant="subtitle2" gutterBottom>
                  Share link:
                </Typography>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded mb-4">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={copySuccess ? <Check size={16} /> : <Copy size={16} />}
                    onClick={handleCopyLink}
                    className={copySuccess ? "text-green-500" : ""}
                  >
                    {copySuccess ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      ) : (
        <>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            className="share-tabs"
          >
            <Tab icon={<Share2 size={16} />} label="Share" />
            <Tab icon={<Clock size={16} />} label="Schedule" />
            <Tab icon={<BarChart2 size={16} />} label="Analytics" />
            <Tab icon={<Clock size={16} />} label="History" />
          </Tabs>
          
          <DialogContent dividers className="share-dialog-content">
            {/* Share tab */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  {/* Add a message field */}
                  <TextField
                    label="Add a message"
                    multiline
                    rows={2}
                    fullWidth
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    placeholder="Write a message to accompany your shared post..."
                  />
                  
                  {/* Sub-tabs for share options */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      className={`py-2 px-4 font-medium text-sm ${activeSubTab === 'users' 
                        ? 'text-orange-500 border-b-2 border-orange-500' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleSubTabChange('users')}
                    >
                      <Users size={16} className="inline mr-2" />
                      Users
                    </button>
                    <button
                      className={`py-2 px-4 font-medium text-sm ${activeSubTab === 'external' 
                        ? 'text-orange-500 border-b-2 border-orange-500' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleSubTabChange('external')}
                    >
                      <Globe size={16} className="inline mr-2" />
                      External
                    </button>
                    <button
                      className={`py-2 px-4 font-medium text-sm ${activeSubTab === 'link' 
                        ? 'text-orange-500 border-b-2 border-orange-500' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleSubTabChange('link')}
                    >
                      <LinkIcon size={16} className="inline mr-2" />
                      Link
                    </button>
                  </div>
                  
                  {/* Share with users panel */}
                  {activeSubTab === 'users' && (
                    <Grow in={activeSubTab === 'users'} timeout={300}>
                      <div className="share-subtab-content">
                        <Box sx={{ mb: 2 }}>
                          <TextField
                            fullWidth
                            placeholder="Search users..."
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        
                        <div className="mb-4">
                          <Chip 
                            icon={<Users size={14} />}
                            label="Share with all followers"
                            clickable
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                              setPreviewPlatform('');
                              handleShareWithFollowers();
                            }}
                            className="share-chip"
                          />
                        </div>
                        
                        <Box sx={{ maxHeight: 300, overflow: 'auto' }} className="user-list">
                          {loading ? (
                            <div className="flex justify-center py-4">
                              <CircularProgress size={24} />
                            </div>
                          ) : filteredUsers.length > 0 ? (
                            <List dense>
                              {filteredUsers.map((u) => (
                                <ListItem
                                  key={u._id}
                                  button
                                  onClick={() => toggleUserSelection(u._id)}
                                  secondaryAction={
                                    <Checkbox
                                      edge="end"
                                      checked={selectedUsers.includes(u._id)}
                                      tabIndex={-1}
                                      disableRipple
                                      color="primary"
                                    />
                                  }
                                >
                                  <ListItemAvatar>
                                    <Avatar src={u.profilePicture}>
                                      {u.username[0]}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText 
                                    primary={u.username} 
                                    secondary={u.bio && u.bio.substring(0, 30) + (u.bio.length > 30 ? '...' : '')}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography align="center" color="textSecondary">
                              {searchQuery ? 'No users match your search' : 'No users available'}
                            </Typography>
                          )}
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          color="primary"
                          fullWidth
                          className="mt-3"
                          disabled={selectedUsers.length === 0 || shareLoading}
                          onClick={() => {
                            setPreviewPlatform('');
                            handleShareWithUsers();
                          }}
                          startIcon={shareLoading ? <CircularProgress size={16} /> : <Share2 size={16} />}
                        >
                          {shareLoading ? 'Sharing...' : 'Share with Selected Users'}
                        </Button>
                      </div>
                    </Grow>
                  )}
                  
                  {/* External sharing panel */}
                  {activeSubTab === 'external' && (
                    <Grow in={activeSubTab === 'external'} timeout={300}>
                      <div className="share-subtab-content">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2">
                          <Button 
                            variant="outlined" 
                            startIcon={<Twitter size={18} />}
                            onClick={() => handleExternalShare('twitter')}
                            onMouseEnter={() => setPreviewPlatform('twitter')}
                            onMouseLeave={() => setPreviewPlatform('')}
                            fullWidth
                            className="share-button twitter"
                          >
                            Twitter
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<Facebook size={18} />}
                            onClick={() => handleExternalShare('facebook')}
                            onMouseEnter={() => setPreviewPlatform('facebook')}
                            onMouseLeave={() => setPreviewPlatform('')}
                            fullWidth
                            className="share-button facebook"
                          >
                            Facebook
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99602 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07049 10.5335 4.06776 11.9246C4.06639 13.3158 4.43033 14.6832 5.126 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8891 11.99 19.9C14.0997 19.9001 16.124 19.0668 17.6222 17.5816C19.1205 16.0965 19.9715 14.0796 19.99 11.97C19.983 10.9173 19.7682 9.87634 19.3581 8.9068C18.948 7.93725 18.3505 7.05819 17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.429 5.51762 10.8372C5.7935 9.24545 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37468C13.9853 5.4617 15.511 6.13426 16.66 7.26999C17.916 8.49818 18.635 10.1735 18.66 11.93C18.6442 13.6859 17.9355 15.3645 16.6882 16.6006C15.441 17.8366 13.756 18.5301 12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.6681 10.3359 10.6827 10.2759 10.6827 10.215C10.6827 10.1541 10.6681 10.0941 10.64 10.04C10.64 9.93999 10.19 8.95999 10.03 8.56999C9.87 8.17999 9.71 8.23999 9.59 8.22999H9.19C9.08895 8.23154 8.9894 8.25465 8.898 8.29776C8.8066 8.34087 8.72546 8.403 8.66 8.47999C8.43562 8.70318 8.26061 8.97261 8.14676 9.27046C8.03291 9.56831 7.98287 9.88797 8 10.21C8.0627 10.9277 8.34443 11.6078 8.81 12.17C9.6495 13.3638 10.7952 14.3054 12.1296 14.8886C12.8024 15.1722 13.5522 15.2915 14.29 15.235C14.677 15.1983 15.0508 15.0714 15.3825 14.8658C15.7141 14.6602 15.9954 14.3812 16.2 14.05C16.43 13.61 16.5 13.24 16.44 12.92C16.38 12.8 16.25 12.75 16.06 12.65L15.61 13.59Z" fill="#4ECB5C"/>
                            </svg>}
                            onClick={() => handleExternalShare('whatsapp')}
                            onMouseEnter={() => setPreviewPlatform('whatsapp')}
                            onMouseLeave={() => setPreviewPlatform('')}
                            fullWidth
                            className="share-button whatsapp"
                          >
                            WhatsApp
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<span className="telegram-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4287 14.0003 10.3658 13.9807 10.3078C13.9611 10.2498 13.9291 10.1989 13.8875 10.1595C13.8459 10.12 13.7962 10.0933 13.7437 10.0824C13.6911 10.0715 13.637 10.0767 13.587 10.098C13.517 10.098 13.087 10.398 12.297 10.998C12.037 11.183 11.817 11.293 11.617 11.273C11.437 11.253 11.077 11.153 10.797 11.053C10.447 10.933 10.167 10.873 10.197 10.673C10.227 10.573 10.347 10.473 10.577 10.363C11.697 9.66302 12.527 9.20302 13.047 8.98302C14.697 8.23302 15.009 8.13302 15.216 8.13302C15.2475 8.13136 15.279 8.13653 15.309 8.14827C15.339 8.16001 15.3672 8.17809 15.392 8.20153C15.4168 8.22496 15.4378 8.25333 15.4538 8.28495C15.4698 8.31657 15.4805 8.35082 15.485 8.38602C15.515 8.51302 15.64 8.8 15.64 8.8H16.64Z" fill="#0088cc"/>
                              </svg>
                            </span>}
                            onClick={() => handleExternalShare('telegram')}
                            onMouseEnter={() => setPreviewPlatform('telegram')}
                            onMouseLeave={() => setPreviewPlatform('')}
                            fullWidth
                            className="share-button telegram"
                          >
                            Telegram
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<Mail size={18} />}
                            onClick={() => handleExternalShare('email')}
                            onMouseEnter={() => setPreviewPlatform('email')}
                            onMouseLeave={() => setPreviewPlatform('')}
                            fullWidth
                            className="share-button email"
                          >
                            Email
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<MessageSquare size={18} />}
                            onClick={() => handleExternalShare('sms')}
                            onMouseEnter={() => setPreviewPlatform('sms')}
                            onMouseLeave={() => setPreviewPlatform('')}
                            fullWidth
                            className="share-button sms"
                          >
                            SMS
                          </Button>
                        </div>
                      </div>
                    </Grow>
                  )}
                  
                  {/* Share link panel */}
                  {activeSubTab === 'link' && (
                    <Grow in={activeSubTab === 'link'} timeout={300}>
                      <div className="share-subtab-content">
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body2" color="textSecondary" paragraph>
                            Generate a link to share this post with anyone. The link will be valid for 7 days.
                          </Typography>
                          
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animated-icon">
                            <LinkIcon size={32} className="text-orange-500" />
                          </div>
                          
                          {shareLink ? (
                            <Box sx={{ mt: 4 }}>
                              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded mb-4 border border-gray-200">
                                <input
                                  type="text"
                                  value={shareLink}
                                  readOnly
                                  className="flex-1 bg-transparent border-none outline-none text-sm"
                                />
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  startIcon={copySuccess ? <Check size={16} /> : <Copy size={16} />}
                                  onClick={handleCopyLink}
                                  className={copySuccess ? "text-green-500" : ""}
                                >
                                  {copySuccess ? "Copied" : "Copy"}
                                </Button>
                              </div>
                              <div className="mt-3 text-center">
                                <Typography variant="caption" color="textSecondary">
                                  This link will expire in 7 days
                                </Typography>
                              </div>
                            </Box>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleCopyLink}
                              startIcon={shareLoading ? <CircularProgress size={16} /> : <LinkIcon size={18} />}
                              className="mt-4"
                              disabled={shareLoading}
                            >
                              {shareLoading ? 'Generating...' : 'Generate Share Link'}
                            </Button>
                          )}
                        </Box>
                      </div>
                    </Grow>
                  )}
                </Grid>
                <Grid item xs={12} md={5}>
                  <div className="bg-gray-50 p-4 rounded-lg h-full preview-container">
                    <SharePreview 
                      platform={previewPlatform} 
                      post={post}
                      message={message}
                      user={user}
                    />
                  </div>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Schedule tab */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <ScheduledShare onSchedule={handleScheduledShare} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <div className="bg-gray-50 p-4 rounded-lg h-full">
                    <Typography variant="subtitle2" className="mb-4 font-medium flex items-center">
                      <Eye size={18} className="mr-2 text-orange-500" />
                      Preview
                    </Typography>
                    <SharePreview 
                      platform="facebook" 
                      post={post}
                      message={message}
                      user={user}
                    />
                  </div>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Analytics tab */}
            <TabPanel value={activeTab} index={2}>
              <ShareStats postId={post._id} />
            </TabPanel>
            
            {/* History tab */}
            <TabPanel value={activeTab} index={3}>
              <ShareHistory postId={post._id} />
            </TabPanel>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
          </DialogActions>
        </>
      )}
      
      <Snackbar 
        open={copySuccess} 
        autoHideDuration={3000} 
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Link copied to clipboard
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ShareDialog; 