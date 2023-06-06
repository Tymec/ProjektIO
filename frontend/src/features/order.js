import { api } from './api'

export const orderApi = api.injectEndpoints({
    tagTypes: ['Order'],
    endpoints: build => ({
        listOrders: build.query({
            query: params => ({
                url: "/orders/?" + new URLSearchParams({
                    search: params?.keyword || '',
                    ordering: `${(params?.asc || false) ? '' : '-'}${params?.orderBy || 'createdAt'}`,
                    page: params?.page || 1
                })
            }),
            transformResponse: response => ({
                orders: response.results,
                page: response.pagination.page,
                pages: response.pagination.pages
            }),
            providesTags: ['Order']
        }),
        myOrders: build.query({
            query: params => ({
                url: "/orders/me/"
            }),
        }),
        getOrder: build.query({
            query: orderId => `/orders/${orderId}/`,
            providesTags: ['Order']
        }),
        deleteOrder: build.mutation({
            query: orderId => ({
                url: `/orders/${orderId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order']
        }),
        createOrder: build.mutation({
            query: newOrder => ({
                url: `/orders/`,
                method: 'POST',
                body: newOrder
            }),
            invalidatesTags: ['Order']
        }),
        updateOrder: build.mutation({
            query: updatedOrder => ({
                url: `/orders/${updatedOrder.id}/`,
                method: 'PUT',
                body: updatedOrder
            }),
            invalidatesTags: ['Order']
        }),
        deliverOrder: build.mutation({
            query: orderId => ({
                url: `/orders/${orderId}/deliver/`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order']
        }),
        payOrder: build.mutation({
            query: (orderId, paymentResult) => ({
                url: `/orders/${orderId}/pay/`,
                method: 'PUT',
                body: paymentResult
            }),
            invalidatesTags: ['Order']
        }),
    })
})

export const { useListOrdersQuery, useGetOrderQuery, useMyOrdersQuery, useDeleteOrderMutation, useCreateOrderMutation, useUpdateOrderMutation, useDeliverOrderMutation, usePayOrderMutation } = orderApi
