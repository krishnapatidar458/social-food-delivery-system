import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLocation, setAgentLocation } from '../redux/deliverySlice';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for real-time location tracking of delivery agents
 * @param {boolean} enabled - Whether location tracking is enabled
 * @param {number} interval - Interval in milliseconds between location updates (default: 1000ms)
 * @returns {Object} Location data and tracking status
 */
const useLocationTracking = (enabled = true, interval = 1000) => {
  const dispatch = useDispatch();
  const { isDeliveryAgent, isAvailable } = useSelector(state => state.delivery);
  const { user } = useSelector(state => state.auth);
  
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });
  
  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  
  // Check if geolocation is available in the browser
  const isGeolocationAvailable = 'geolocation' in navigator;
  
  // Function to get the current position
  const getCurrentPosition = () => {
    if (!isGeolocationAvailable) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newPosition = {
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        };
        
        setCurrentPosition(newPosition);
        
        // Update local Redux state
        dispatch(setCurrentLocation({ latitude, longitude }));
        
        // Send to server if the user is a delivery agent and is available
        if (isDeliveryAgent && isAvailable) {
          dispatch(setAgentLocation({ latitude, longitude }))
            .catch(err => {
              console.error('Failed to update location on server:', err);
            });
        }
      },
      (error) => {
        let errorMessage = 'Unknown error occurred while getting location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
        
        setError(errorMessage);
        if (!isTracking) {
          toast.error(errorMessage);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  // Start location tracking
  const startTracking = () => {
    if (!isGeolocationAvailable) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    // Stop existing tracking first to avoid duplicates
    stopTracking();
    
    // Get initial position
    getCurrentPosition();
    
    // Set up interval for periodic updates
    intervalIdRef.current = setInterval(getCurrentPosition, interval);
    
    setIsTracking(true);
    return true;
  };
  
  // Stop location tracking
  const stopTracking = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    setIsTracking(false);
    return true;
  };
  
  // Effect to start/stop tracking based on enabled prop
  useEffect(() => {
    if (enabled && isDeliveryAgent) {
      startTracking();
    } else {
      stopTracking();
    }
    
    return () => {
      stopTracking();
    };
  }, [enabled, isDeliveryAgent, interval]);
  
  return {
    position: currentPosition,
    isTracking,
    error,
    isAvailable: isGeolocationAvailable,
    startTracking,
    stopTracking
  };
};

export default useLocationTracking; 