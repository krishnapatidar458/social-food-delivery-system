import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import postSlice from "./postSlice";
import categorySlice from "./categorySlice";
import userSlice from './userSlice';
import cartSlice from './cartSlice';
import socketSlice from './socketSlice';
import chatSlice from './chatSlice';
import rtnSlice from "./rtnSlice"
<<<<<<< HEAD
import adminSlice from "./adminSlice";
import deliverySlice from "./deliverySlice";
import { createLogger } from 'redux-logger';
=======

>>>>>>> main

// Create logger instance
const logger = createLogger({
  collapsed: true, // Collapse console groups by default
  diff: true,      // Show diff between states
  predicate: () => process.env.NODE_ENV === 'development', // Only log in development
});

// Main persist config
const persistConfig = {
  key: "root",
  storage,
  version: 1,
<<<<<<< HEAD
  blacklist: ['socket', 'cart', 'delivery'], // Don't persist socket, cart, or delivery in root
};

// Separate config for cart slice
const cartPersistConfig = {
  key: 'cart',
  storage,
  blacklist: ['orderStatus', 'orderError'], // Don't persist these transient states
};

// Config for chat slice
const chatPersistConfig = {
  key: 'chat',
  storage,
};

// Config for delivery slice
const deliveryPersistConfig = {
  key: 'delivery',
  storage,
  blacklist: ['isActionPending', 'actionError', 'isLocationUpdating', 'isNearbyOrdersLoading'], // Don't persist these transient states
=======
  // Don't persist socket state to avoid serialization issues
  blacklist: ['socket'],
};

// Separate config for chat slice to properly handle the sensitive parts
const chatPersistConfig = {
  key: 'chat',
  storage,
  // Ensure we have proper structures on rehydration
  migrate: (state) => {
    // If the state is invalid or missing fields, return the default structure
    if (!state || !state.unreadCounts) {
      return {
        ...state,
        onlineUsers: state?.onlineUsers || [],
        messages: state?.messages || [],
        unreadCounts: {}
      };
    }
    return state;
  }
>>>>>>> main
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  category: categorySlice,
  user: userSlice,
<<<<<<< HEAD
  cart: persistReducer(cartPersistConfig, cartSlice),
  socket: socketSlice,
  chat: persistReducer(chatPersistConfig, chatSlice),
  realTimeNotification: rtnSlice,
  admin: adminSlice,
  delivery: persistReducer(deliveryPersistConfig, deliverySlice),
=======
  cart: cartSlice,
  socket: socketSlice,
  chat: persistReducer(chatPersistConfig, chatSlice),
  realTimeNotification: rtnSlice,
>>>>>>> main
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH, 
          REHYDRATE, 
          PAUSE, 
          PERSIST, 
          PURGE, 
          REGISTER,
<<<<<<< HEAD
        ],
=======
          // Ignore socket connection actions
          'socketio/setSocketConnected',
        ],
        // Ignore non-serializable data in these paths
        ignoredPaths: ['socket'],
>>>>>>> main
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

export default store;
