import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.userState?.user?.token;
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    validateStatus: (response) => {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('user');
      }
      return response.status < 500;
    }
  }),
  tagTypes: ['Product', 'Order', 'Review', 'User'],
  endpoints: () => ({})
});
