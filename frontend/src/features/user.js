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
        email: action.payload.email,
        isAdmin: action.payload.isAdmin,
        token: action.payload.token,
        name: action.payload.name,
        id: action.payload._id
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
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
          if (data?.detail) throw new Error({ error: data.detail });
          dispatch(setUser(data));
        } catch (error) {
          console.error(error);
        }
      },
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
          dispatch(setUser(data));
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ['User']
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
        users: response.results,
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
