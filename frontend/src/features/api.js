import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api', // Set the base URL for API requests
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.userState?.user?.token; // Get the token from the Redux state
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`); // Add the token to the request headers if it exists
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'Review', 'User'], // Define tag types for the API endpoints
  endpoints: () => ({}) // Define the API endpoints
});
