import { api } from './api'
import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = {
                email: action.payload.email,
                isAdmin: action.payload.isAdmin,
                token: action.payload.token
            }
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        logout: state => {
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
                url: `/users/${updatedUser.id}/`,
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
            query: page => `/users/?page=${page}`
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation, useListUsersQuery } = userApi
