import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    connected: false,
    socketId: null
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.connected = action.payload.connected;
      state.socketId = action.payload.socketId;
    },
    resetSocketState: (state) => {
      state.connected = false;
      state.socketId = null;
    }
  },
});

export default socketSlice.reducer;
export const { setSocketConnected, resetSocketState } = socketSlice.actions;
