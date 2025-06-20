import { createSlice } from "@reduxjs/toolkit";

<<<<<<< HEAD
const initialState = {
  connected: false,
  socketId: null,
  orderStatusUpdates: []
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
=======
const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    connected: false,
    socketId: null
  },
>>>>>>> main
  reducers: {
    setSocketConnected: (state, action) => {
      state.connected = action.payload.connected;
      state.socketId = action.payload.socketId;
    },
    resetSocketState: (state) => {
      state.connected = false;
      state.socketId = null;
<<<<<<< HEAD
      // Keep order status updates in case we reconnect
    },
    addOrderStatusUpdate: (state, action) => {
      state.orderStatusUpdates.push(action.payload);
      // Keep only the latest 10 updates
      if (state.orderStatusUpdates.length > 10) {
        state.orderStatusUpdates.shift();
      }
    },
    clearOrderStatusUpdates: (state) => {
      state.orderStatusUpdates = [];
=======
>>>>>>> main
    }
  },
});

<<<<<<< HEAD
export const { 
  setSocketConnected, 
  resetSocketState, 
  addOrderStatusUpdate, 
  clearOrderStatusUpdates 
} = socketSlice.actions;

export default socketSlice.reducer;
=======
export default socketSlice.reducer;
export const { setSocketConnected, resetSocketState } = socketSlice.actions;
>>>>>>> main
