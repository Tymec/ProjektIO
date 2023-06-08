import { api } from './api'

export const orderApi = api.injectEndpoints({
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
            providesTags: (result) => result
            ? [...result.orders.map(({ _id: id }) => ({ type: 'Order', id })), 'Order']
            : ['Order'],
        }),
        myOrders: build.query({
            query: () => ({
                url: "/orders/me/"
            }),
            providesTags: (result) => result
            ? [...result.map(({ _id: id }) => ({ type: 'Order', id })), 'Order']
            : ['Order'],
        }),
        getOrder: build.query({
            query: orderId => `/orders/${orderId}/`,
            providesTags: (result) => result
            ? [{ type: 'Order', id: result._id }, 'Order']
            : ['Order'],
        }),
        deleteOrder: build.mutation({
            query: orderId => ({
                url: `/orders/${orderId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result) => result
            ? [{ type: 'Order', id: result._id }, 'Order']
            : ['Order'],
        }),
        createOrder: build.mutation({
            query: newOrder => ({
                url: `/orders/`,
                method: 'POST',
                body: newOrder
            }),
            invalidatesTags: (result) => result
            ? [{ type: 'Order', id: result._id }, 'Order']
            : ['Order'],
        }),
        updateOrder: build.mutation({
            query: updatedOrder => ({
                url: `/orders/${updatedOrder.id}/`,
                method: 'PUT',
                body: updatedOrder
            }),
            invalidatesTags: (result) => result
            ? [{ type: 'Order', id: result._id }, 'Order']
            : ['Order'],
        }),
        deliverOrder: build.mutation({
            query: orderId => ({
                url: `/orders/${orderId}/deliver/`,
                method: 'PUT',
            }),
            invalidatesTags: (result) => result
            ? [{ type: 'Order', id: result._id }, 'Order']
            : ['Order'],
        }),
        payOrder: build.mutation({
            query: (orderId, paymentResult) => ({
                url: `/orders/${orderId}/pay/`,
                method: 'PUT',
                body: paymentResult
            }),
            invalidatesTags: (result) => result
            ? [{ type: 'Order', id: result._id }, 'Order']
            : ['Order'],
        }),
    })
})

export const { useListOrdersQuery, useGetOrderQuery, useMyOrdersQuery, useDeleteOrderMutation, useCreateOrderMutation, useUpdateOrderMutation, useDeliverOrderMutation, usePayOrderMutation } = orderApi
