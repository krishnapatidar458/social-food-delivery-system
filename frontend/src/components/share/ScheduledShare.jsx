import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar
} from '@mui/material';
import { Calendar, AlertCircle } from 'lucide-react';

// Simple utility to add hours to a date
const addHours = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

// Check if a date is in the future
const isFuture = (date) => {
  return date > new Date();
};

// Format date for datetime-local input
const formatDateForInput = (date) => {
  return date.toISOString().slice(0, 16);
};

// This component would need to be connected to a backend service that can schedule shares
const ScheduledShare = ({ onSchedule }) => {
  const [scheduleDate, setScheduleDate] = useState(formatDateForInput(addHours(new Date(), 1)));
  const [platform, setPlatform] = useState('');
  const [audience, setAudience] = useState('followers');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleScheduleSubmit = () => {
    // Validate inputs
    if (!platform) {
      setError('Please select a platform');
      return;
    }

    const selectedDate = new Date(scheduleDate);
    if (!isFuture(selectedDate)) {
      setError('Schedule time must be in the future');
      return;
    }

    // In a real implementation, this would make an API call to schedule the share
    const scheduleData = {
      scheduledFor: selectedDate,
      platform,
      audience,
      message,
      status: 'scheduled'
    };

    // Call the onSchedule prop with the schedule data
    if (onSchedule) {
      onSchedule(scheduleData);
    }

    // Show success message
    setSuccess(true);
    
    // Reset form
    setPlatform('');
    setMessage('');
    setScheduleDate(formatDateForInput(addHours(new Date(), 1)));
  };

  return (
    <Paper className="p-4 rounded-lg">
      <Typography variant="subtitle1" className="font-medium mb-4 flex items-center">
        <Calendar size={20} className="mr-2 text-orange-500" />
        Schedule Your Share
      </Typography>
      
      <Box className="space-y-4">
        <TextField
          label="Schedule Date & Time"
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          className="mb-4"
        />
        
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="platform-select-label">Platform</InputLabel>
          <Select
            labelId="platform-select-label"
            id="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            label="Platform"
          >
            <MenuItem value="twitter">Twitter</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
            <MenuItem value="telegram">Telegram</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="audience-select-label">Share With</InputLabel>
          <Select
            labelId="audience-select-label"
            id="audience-select"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            label="Share With"
          >
            <MenuItem value="followers">All Followers</MenuItem>
            <MenuItem value="specific">Specific Users</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </Select>
          {audience === 'specific' && (
            <FormHelperText>
              Note: You will need to select users before scheduling
            </FormHelperText>
          )}
        </FormControl>
        
        <TextField
          fullWidth
          label="Share Message"
          multiline
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message to accompany your share..."
          variant="outlined"
          className="mb-4"
        />
        
        <Box className="p-3 bg-blue-50 rounded-lg mb-4 flex items-start">
          <AlertCircle size={20} className="text-blue-500 mr-2 mt-0.5" />
          <div>
            <Typography variant="body2" className="font-medium text-blue-700">
              Scheduled Share Information
            </Typography>
            <Typography variant="caption" className="text-blue-600">
              Your share will be automatically posted at the scheduled time. You can view and manage your scheduled shares in your account settings.
            </Typography>
          </div>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleScheduleSubmit}
          className="mt-2"
          disabled={!platform || !scheduleDate}
        >
          Schedule Share
        </Button>
      </Box>
      
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Your share has been scheduled successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ScheduledShare; 