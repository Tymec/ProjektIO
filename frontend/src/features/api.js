import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8000/api'
    }),
    prepareHeaders: (headers, { getState }) => {
        const { token } = getState()?.user
        if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
    endpoints: build => ({
    })
})
