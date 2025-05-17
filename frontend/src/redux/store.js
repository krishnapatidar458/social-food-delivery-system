import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {
  persistReducer,
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


const persistConfig = {
  key: "root",
  storage,
  version: 1,
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
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  category: categorySlice,
  user: userSlice,
  cart: cartSlice,
  socket: socketSlice,
  chat: persistReducer(chatPersistConfig, chatSlice),
  realTimeNotification: rtnSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

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
          // Ignore socket connection actions
          'socketio/setSocketConnected',
        ],
        // Ignore non-serializable data in these paths
        ignoredPaths: ['socket'],
      },
    }),
});

export default store;
