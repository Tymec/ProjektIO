import { createSlice } from '@reduxjs/toolkit';

const getFromLocalStorage = (key, def = '') => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return def;
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getFromLocalStorage('cartItems', [])
  },
  reducers: {
    addToCart: (state, action) => {
      const { qty, id, increment = false } = action.payload;

      const existItem = state.items.find((x) => x.id === id);
      if (existItem) {
        state.items = state.items.map((x) => {
          let item = x;
          if (x.id === existItem.id) {
            item = increment ? { id, qty: x.qty + 1 } : { id, qty };
          }
          return item;
        });
      } else {
        state.items.push({ id, qty });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((x) => x.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    resetCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
