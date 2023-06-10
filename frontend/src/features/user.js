import { createSlice } from '@reduxjs/toolkit';

import { api } from './api';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = {
        // Set the user state with the provided payload
        email: action.payload.email,
        isAdmin: action.payload.isAdmin,
        token: action.payload.token,
        name: action.payload.name,
        id: action.payload._id
      };
      localStorage.setItem('user', JSON.stringify(state.user)); // Store the user data in local storage
    },
    logout: (state) => {
      state.user = null; // Clear the user state
      localStorage.removeItem('user'); // Remove the user data from local storage
    }
  }
});

export const { logout, setUser } = userSlice.actions;

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (authData) => ({
        url: `/users/login/`,
        method: 'POST',
        body: authData
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data)); // Dispatch setUser action to update the user state with the logged-in user data
        } catch (error) {
          console.error(error);
        }
      }
    }),
    register: build.mutation({
      query: (authData) => ({
        url: `/users/register/`,
        method: 'POST',
        body: authData
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data)); // Dispatch setUser action to update the user state with the registered user data
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ['User'] // Invalidates the 'User' tags after a successful registration
    }),
    getUser: build.query({
      query: (userId) => `/users/${userId}/`,
      providesTags: (result) => (result ? [{ type: 'User', id: result._id }, 'User'] : ['User'])
    }),
    updateUser: build.mutation({
      query: (updatedUser) => ({
        url: `/users/${updatedUser._id}/`,
        method: 'PUT',
        body: updatedUser
      }),
      invalidatesTags: (result) => (result ? [{ type: 'User', id: result._id }, 'User'] : ['User'])
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/users/${userId}/`,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [{ type: 'User', id: result._id }, 'User'] : ['User'])
    }),
    listUsers: build.query({
      query: (page) => `/users/?page=${page}`,
      transformResponse: (response) => ({
        users: response.results, // Transform the response to include the users, page, and pages properties
        page: response.pagination.page,
        pages: response.pagination.pages
      }),
      providesTags: (result) =>
        result ? [...result.users.map(({ _id: id }) => ({ type: 'User', id })), 'User'] : ['User']
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useListUsersQuery
} = userApi;
