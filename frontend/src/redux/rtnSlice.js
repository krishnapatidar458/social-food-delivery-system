import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
    dislikeNotification: [],
    seen: false,
    
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        console.log(action.payload);
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    setDislikeNotification: (state, action) => {
      state.dislikeNotification.push(action.payload);
      state.seen = false;
    },
    clearNotifications: (state) => {
      state.likeNotification = [];
    },
    markNotificationsSeen: (state) => {
      state.seen = true;
    },
  },
});

export const { setLikeNotification, clearNotifications, markNotificationsSeen ,setDislikeNotification } =
  rtnSlice.actions;
export default rtnSlice.reducer;
