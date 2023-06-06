import { api } from './api'
import { createSlice } from '@reduxjs/toolkit'

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
            }
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        logout: (state, action) => {
            state.user = null
            localStorage.removeItem('user')
        }
    },
})

export const { logout, setUser } = userSlice.actions

export const userApi = api.injectEndpoints({
    endpoints: build => ({
        login: build.mutation({
            query: authData => ({
                url: `/users/login/`,
                method: 'POST',
                body: authData
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                } catch (error) {}
            },
        }),
        register: build.mutation({
            query: authData => ({
                url: `/users/register/`,
                method: 'POST',
                body: authData
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                } catch (error) {}
            }
        }),
        getUser: build.query({
            query: userId => `/users/${userId}/`
        }),
        updateUser: build.mutation({
            query: updatedUser => ({
                url: `/users/${updatedUser._id}/`,
                method: 'PUT',
                body: updatedUser
            })
        }),
        deleteUser: build.mutation({
            query: userId => ({
                url: `/users/${userId}/`,
                method: 'DELETE',
            })
        }),
        listUsers: build.query({
            query: page => `/users/?page=${page}`,
            transformResponse: (response) => ({
                users: response.results,
                page: response.pagination.page,
                pages: response.pagination.pages
            })
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation, useListUsersQuery } = userApi
