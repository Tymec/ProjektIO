import { configureStore } from '@reduxjs/toolkit';

import { api } from './features/api';
import { cartSlice } from './features/cart';
import { userSlice } from './features/user';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    userState: userSlice.reducer,
    cartState: cartSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});

export default store;
