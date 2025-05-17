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
};
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  category: categorySlice,
  user: userSlice,
  cart: cartSlice,
  socket: socketSlice,
  chat: chatSlice,
  realTimeNotification: rtnSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
