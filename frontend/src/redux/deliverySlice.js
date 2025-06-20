import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  registerAsDeliveryAgent, 
  getAgentProfile, 
  updateAvailability, 
  updateLocation,
  getNearbyOrders,
  acceptOrder,
  rejectOrder,
  completeDelivery,
  verifyDeliveryAgent as verifyDeliveryAgentAPI,
  getDeliveryHistory
} from "../services/deliveryService";

// Async thunk for registering as delivery agent
export const registerAgent = createAsyncThunk(
  "delivery/registerAgent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerAsDeliveryAgent(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to register as delivery agent");
    }
  }
);

// Async thunk for fetching agent profile
export const fetchAgentProfile = createAsyncThunk(
  "delivery/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAgentProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch agent profile");
    }
  }
);

// Async thunk for fetching delivery history
export const fetchDeliveryHistory = createAsyncThunk(
  "delivery/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeliveryHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch delivery history");
    }
  }
);

// Async thunk for updating availability
export const setAgentAvailability = createAsyncThunk(
  "delivery/setAvailability",
  async (isAvailable, { rejectWithValue }) => {
    try {
      const response = await updateAvailability(isAvailable);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update availability");
    }
  }
);

// Async thunk for updating location
export const setAgentLocation = createAsyncThunk(
  "delivery/setLocation",
  async ({ longitude, latitude }, { rejectWithValue }) => {
    try {
      const response = await updateLocation(longitude, latitude);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update location");
    }
  }
);

// Async thunk for fetching nearby orders
export const fetchNearbyOrders = createAsyncThunk(
  "delivery/fetchNearbyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNearbyOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch nearby orders");
    }
  }
);

// Async thunk for accepting an order
export const acceptDeliveryOrder = createAsyncThunk(
  "delivery/acceptOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await acceptOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to accept order");
    }
  }
);

// Async thunk for rejecting an order
export const rejectDeliveryOrder = createAsyncThunk(
  "delivery/rejectOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await rejectOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reject order");
    }
  }
);

// Async thunk for completing a delivery
export const completeDeliveryOrder = createAsyncThunk(
  "delivery/completeDelivery",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await completeDelivery(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to complete delivery");
    }
  }
);

// Async thunk for verifying a delivery agent (admin only)
export const verifyDeliveryAgent = createAsyncThunk(
  "delivery/verifyAgent",
  async ({ agentId, isVerified }, { rejectWithValue }) => {
    try {
      const response = await verifyDeliveryAgentAPI(agentId, isVerified);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to verify agent");
    }
  }
);

const initialState = {
  isDeliveryAgent: false,
  isRegistering: false,
  isRegistrationError: false,
  registrationError: null,
  profile: null,
  isAvailable: false,
  isProfileLoading: false,
  isProfileError: false,
  profileError: null,
  currentLocation: {
    longitude: 0,
    latitude: 0,
  },
  isLocationUpdating: false,
  nearbyOrders: [],
  isNearbyOrdersLoading: false,
  isNearbyOrdersError: false,
  nearbyOrdersError: null,
  activeOrders: [],
  isActionPending: false,
  actionError: null,
  deliveryHistory: [],
  stats: {
    completedDeliveries: 0,
    rating: 0,
    totalRatings: 0,
  },
  verificationStatus: {
    isPending: false,
    error: null,
    success: false
  },
  isRejecting: false,
  rejectedOrderIds: [],
};

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    resetDeliveryState: () => initialState,
    clearVerificationStatus: (state) => {
      state.verificationStatus = {
        isPending: false,
        error: null,
        success: false
      };
    }
  },
  extraReducers: (builder) => {
    // Register as delivery agent
    builder.addCase(registerAgent.pending, (state) => {
      state.isRegistering = true;
      state.isRegistrationError = false;
      state.registrationError = null;
    });
    builder.addCase(registerAgent.fulfilled, (state, action) => {
      state.isRegistering = false;
      state.isDeliveryAgent = true;
      state.profile = action.payload.agent;
    });
    builder.addCase(registerAgent.rejected, (state, action) => {
      state.isRegistering = false;
      state.isRegistrationError = true;
      state.registrationError = action.payload;
    });

    // Fetch agent profile
    builder.addCase(fetchAgentProfile.pending, (state) => {
      state.isProfileLoading = true;
      state.isProfileError = false;
      state.profileError = null;
    });
    builder.addCase(fetchAgentProfile.fulfilled, (state, action) => {
      state.isProfileLoading = false;
      state.profile = action.payload.agent;
      state.isDeliveryAgent = true;
      state.isAvailable = action.payload.agent.isAvailable;
      state.currentLocation = {
        longitude: action.payload.agent.currentLocation.coordinates[0],
        latitude: action.payload.agent.currentLocation.coordinates[1],
      };
      state.activeOrders = action.payload.agent.activeOrders || [];
      state.deliveryHistory = action.payload.agent.deliveryHistory || [];
      state.stats = action.payload.stats || initialState.stats;
    });
    builder.addCase(fetchAgentProfile.rejected, (state, action) => {
      state.isProfileLoading = false;
      state.isProfileError = true;
      state.profileError = action.payload;
      // If 404 not found, not a delivery agent
      if (action.payload && action.payload.includes("not found")) {
        state.isDeliveryAgent = false;
      }
    });

    // Update availability
    builder.addCase(setAgentAvailability.pending, (state) => {
      state.isActionPending = true;
      state.actionError = null;
    });
    builder.addCase(setAgentAvailability.fulfilled, (state, action) => {
      state.isActionPending = false;
      state.isAvailable = action.payload.agent.isAvailable;
    });
    builder.addCase(setAgentAvailability.rejected, (state, action) => {
      state.isActionPending = false;
      state.actionError = action.payload;
    });

    // Update location
    builder.addCase(setAgentLocation.pending, (state) => {
      state.isLocationUpdating = true;
    });
    builder.addCase(setAgentLocation.fulfilled, (state, action) => {
      state.isLocationUpdating = false;
      state.currentLocation = {
        longitude: action.payload.currentLocation.coordinates[0],
        latitude: action.payload.currentLocation.coordinates[1],
      };
    });
    builder.addCase(setAgentLocation.rejected, (state) => {
      state.isLocationUpdating = false;
    });

    // Fetch nearby orders
    builder.addCase(fetchNearbyOrders.pending, (state) => {
      state.isNearbyOrdersLoading = true;
      state.isNearbyOrdersError = false;
      state.nearbyOrdersError = null;
    });
    builder.addCase(fetchNearbyOrders.fulfilled, (state, action) => {
      state.isNearbyOrdersLoading = false;
      state.nearbyOrders = action.payload.orders || [];
    });
    builder.addCase(fetchNearbyOrders.rejected, (state, action) => {
      state.isNearbyOrdersLoading = false;
      state.isNearbyOrdersError = true;
      state.nearbyOrdersError = action.payload;
    });

    // Accept order
    builder.addCase(acceptDeliveryOrder.pending, (state) => {
      state.isActionPending = true;
      state.actionError = null;
    });
    builder.addCase(acceptDeliveryOrder.fulfilled, (state, action) => {
      state.isActionPending = false;
      state.activeOrders = [...state.activeOrders, action.payload.order];
      state.nearbyOrders = state.nearbyOrders.filter(
        (order) => order._id !== action.payload.order._id
      );
    });
    builder.addCase(acceptDeliveryOrder.rejected, (state, action) => {
      state.isActionPending = false;
      state.actionError = action.payload;
    });

    // Reject order
    builder.addCase(rejectDeliveryOrder.pending, (state) => {
      state.isRejecting = true;
      state.actionError = null;
    });
    builder.addCase(rejectDeliveryOrder.fulfilled, (state, action) => {
      state.isRejecting = false;
      // Remove the rejected order from the nearby orders list
      state.nearbyOrders = state.nearbyOrders.filter(
        (order) => order._id !== action.payload.orderId
      );
      // Add order ID to rejected orders list
      state.rejectedOrderIds.push(action.payload.orderId);
    });
    builder.addCase(rejectDeliveryOrder.rejected, (state, action) => {
      state.isRejecting = false;
      state.actionError = action.payload;
    });

    // Complete delivery
    builder.addCase(completeDeliveryOrder.pending, (state) => {
      state.isActionPending = true;
      state.actionError = null;
    });
    builder.addCase(completeDeliveryOrder.fulfilled, (state, action) => {
      state.isActionPending = false;
      state.activeOrders = state.activeOrders.filter(
        (order) => order._id !== action.payload.order._id
      );
      state.deliveryHistory = [...state.deliveryHistory, action.payload.order];
      state.stats.completedDeliveries += 1;
    });
    builder.addCase(completeDeliveryOrder.rejected, (state, action) => {
      state.isActionPending = false;
      state.actionError = action.payload;
    });

    // Fetch delivery history
    builder.addCase(fetchDeliveryHistory.pending, (state) => {
      state.isProfileLoading = true;
      state.isProfileError = false;
      state.profileError = null;
    });
    builder.addCase(fetchDeliveryHistory.fulfilled, (state, action) => {
      state.isProfileLoading = false;
      state.deliveryHistory = action.payload.deliveryHistory || [];
    });
    builder.addCase(fetchDeliveryHistory.rejected, (state, action) => {
      state.isProfileLoading = false;
      state.isProfileError = true;
      state.profileError = action.payload;
    });

    // Verify delivery agent (admin only)
    builder.addCase(verifyDeliveryAgent.pending, (state) => {
      state.verificationStatus.isPending = true;
      state.verificationStatus.error = null;
      state.verificationStatus.success = false;
    });
    builder.addCase(verifyDeliveryAgent.fulfilled, (state, action) => {
      state.verificationStatus.isPending = false;
      state.verificationStatus.success = true;
      
      // If this is the current user's agent profile, update it
      if (state.profile && state.profile._id === action.payload.agent._id) {
        state.profile.isVerified = action.payload.agent.isVerified;
      }
    });
    builder.addCase(verifyDeliveryAgent.rejected, (state, action) => {
      state.verificationStatus.isPending = false;
      state.verificationStatus.error = action.payload;
    });
  },
});

export const { setCurrentLocation, resetDeliveryState, clearVerificationStatus } = deliverySlice.actions;

export default deliverySlice.reducer; 