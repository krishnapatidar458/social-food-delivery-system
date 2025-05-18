import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    shorts: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setUserShorts: (state, action) => {
      state.shorts = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateBookmarks: (state, action) => {
      if (state.user) {
        const postId = action.payload;
        const isCurrentlyBookmarked = state.user.bookmarks?.includes(postId);
        
        if (isCurrentlyBookmarked) {
          // Remove from bookmarks
          state.user.bookmarks = state.user.bookmarks.filter(id => id !== postId);
        } else {
          // Add to bookmarks
          state.user.bookmarks = state.user.bookmarks ? [...state.user.bookmarks, postId] : [postId];
        }
      }
    },
  },
});

export default authSlice.reducer;
export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setUserShorts,
  setSelectedUser,
  updateBookmarks,
} = authSlice.actions;
