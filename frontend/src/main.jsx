import './bootstrap.min.css';
import './index.css';

import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routesConfig from './router'; // Import the routes configuration
import storeConfig from './store'; // Import the store configuration

// Create the browser router using the routes configuration
const router = createBrowserRouter(routesConfig);

// Configure the Redux store
const store = configureStore(storeConfig);

// Render the app using React StrictMode, Redux Provider, and React Router Provider
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
