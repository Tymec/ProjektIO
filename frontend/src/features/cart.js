import { createSlice } from '@reduxjs/toolkit';

const getFromLocalStorage = (key, def = '') => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value); // Parse the stored value as JSON if it exists
  }
  return def; // Return the default value if the stored value doesn't exist
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getFromLocalStorage('cartItems', []) // Initialize the cart items from local storage
  },
  reducers: {
    addToCart: (state, action) => {
      const { qty, id, increment = false } = action.payload;

      const existItem = state.items.find((x) => x.id === id);
      if (existItem) {
        state.items = state.items.map((x) => {
          let item = x;
          if (x.id === existItem.id) {
            item = increment ? { id, qty: x.qty + 1 } : { id, qty }; // Increment the quantity if increment is true, otherwise set the quantity to the provided value
          }
          return item;
        });
      } else {
        state.items.push({ id, qty }); // Add a new item to the cart
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Store the updated cart items in local storage
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((x) => x.id !== action.payload); // Remove the item with the specified ID from the cart
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Store the updated cart items in local storage
    },
    resetCart: (state) => {
      state.items = []; // Reset the cart items to an empty array
      localStorage.removeItem('cartItems'); // Remove the cart items from local storage
    }
  }
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
