// redux/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (!existingItem) {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload._id);
      if (item) item.quantity++;
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload._id);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        // If quantity is 1, remove from cart
        state.cartItems = state.cartItems.filter(
          (i) => i._id !== action.payload._id
        );
      }
    },
    removeFromCart: (state, action) => {
      const idToRemove = action.payload._id || action.payload;
      state.cartItems = state.cartItems.filter((i) => i._id !== idToRemove);
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
