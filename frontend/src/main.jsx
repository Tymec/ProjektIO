import './bootstrap.min.css';
import './index.css';

import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routesConfig from './router';
import storeConfig from './store';

const router = createBrowserRouter(routesConfig);
const store = configureStore(storeConfig);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
