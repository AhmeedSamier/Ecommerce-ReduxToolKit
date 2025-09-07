


import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  userInfo: null,
  wishlist: []
}

export const appSlice = createSlice({
  name: 'Ecommerce',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },

    increment: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) item.quantity++;
    },

    decrement: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },

    RemoveItem: (state, action) => {
      state.products = state.products.filter((item) => item.id !== action.payload.id);
    },

    clearCart: (state) => {
      state.products = [];
    },

    setUser: (state, action) => {
      state.userInfo = action.payload;
    },

    logoutUser: (state) => {
      state.userInfo = null;
    },

    addToWishlist: (state, action) => {
      const item = state.wishlist.find((item) => item.id === action.payload.id);
      if (!item) {
        state.wishlist.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => item.id !== action.payload.id);
    },

    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },
});

export const { 
  addToCart, 
  increment, 
  decrement, 
  RemoveItem, 
  clearCart, 
  setUser, 
  logoutUser, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} = appSlice.actions;

export default appSlice.reducer;
