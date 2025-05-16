// src/redux/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchCurrentUserFollowings = createAsyncThunk(
  "user/fetchCurrentUserFollowings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/followings",
        {
          withCredentials: true,
        }
      );
      return res.data.followings;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch followings"
      );
    }
  }
);

export const followOrUnfollow = createAsyncThunk(
  "user/followOrUnfollow",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      return { userId: targetUserId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    followings: [], // stores user IDs
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    setFollowing: (state, action) => {
      state.followings = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followOrUnfollow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followOrUnfollow.fulfilled, (state, action) => {
        const { userId, message } = action.payload;
        const isAlreadyFollowing = state.followings.includes(userId);
        state.followings = isAlreadyFollowing
          ? state.followings.filter((id) => id !== userId)
          : [...state.followings, userId];
        state.message = message;
        state.loading = false;
      })
      .addCase(followOrUnfollow.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      ;
  },
});

export const { setFollowing, clearMessage } = userSlice.actions;
export default userSlice.reducer;
