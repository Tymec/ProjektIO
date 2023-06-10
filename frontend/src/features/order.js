import { api } from './api';

export const orderApi = api.injectEndpoints({
  endpoints: (build) => ({
    listOrders: build.query({
      query: (params) => ({
        url:
          '/orders/?' +
          new URLSearchParams({
            search: params?.keyword || '',
            ordering: `${params?.asc || false ? '' : '-'}${params?.orderBy || 'createdAt'}`,
            page: params?.page || 1
          }) // Build the query parameters for listing orders
      }),
      transformResponse: (response) => ({
        orders: response.results,
        page: response.pagination.page,
        pages: response.pagination.pages
      }), // Transform the response to include orders, page, and pages properties
      providesTags: (result) =>
        result
          ? [...result.orders.map(({ _id: id }) => ({ type: 'Order', id })), 'Order']
          : ['Order'] // Provide tags for caching based on the fetched orders
    }),
    myOrders: build.query({
      query: () => ({
        url: '/orders/me/?' // Make a GET request to fetch the logged-in user's orders
      }),
      providesTags: (result) =>
        result ? [...result.map(({ _id: id }) => ({ type: 'Order', id })), 'Order'] : ['Order'] // Provide tags for caching based on the fetched orders
    }),
    getOrder: build.query({
      query: (orderId) => `/orders/${orderId}/`, // Make a GET request to fetch an order with the specified ID
      providesTags: (result) => (result ? [{ type: 'Order', id: result._id }, 'Order'] : ['Order']) // Provide tags for caching based on the fetched order
    }),
    deleteOrder: build.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/`,
        method: 'DELETE' // Make a DELETE request to delete an order with the specified ID
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Order', id: result._id }, 'Order'] : ['Order'] // Invalidate the cached order with the deleted ID
    }),
    createOrder: build.mutation({
      query: (newOrder) => ({
        url: `/orders/`,
        method: 'POST',
        body: newOrder // Make a POST request to create a new order with the provided data
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Order', id: result._id }, 'Order'] : ['Order'] // Invalidate the cached order after creating a new one
    }),
    updateOrder: build.mutation({
      query: (updatedOrder) => ({
        url: `/orders/${updatedOrder.id}/`,
        method: 'PUT',
        body: updatedOrder // Make a PUT request to update an order with the provided data
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Order', id: result._id }, 'Order'] : ['Order'] // Invalidate the cached order after updating it
    }),
    deliverOrder: build.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver/`,
        method: 'PUT' // Make a PUT request to mark an order as delivered with the specified ID
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Order', id: result._id }, 'Order'] : ['Order'] // Invalidate the cached order after marking it as delivered
    })
  })
});

export const {
  useListOrdersQuery,
  useGetOrderQuery,
  useMyOrdersQuery,
  useDeleteOrderMutation,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeliverOrderMutation
} = orderApi;
