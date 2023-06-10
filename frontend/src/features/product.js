import { api } from './api';

export const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    listProducts: build.query({
      query: (params) => ({
        url: '/products/', // Make a GET request to fetch products
        params: {
          search: params?.keyword || '',
          ordering: `${params?.asc || false ? '' : '-'}${params?.orderBy || 'rating'}`,
          page: params?.page || 1,
          ids: params?.ids || ''
        }
      }),
      transformResponse: (response) => ({
        products: response.results, // Transform the response to include the products, page, and pages properties
        page: response.pagination.page,
        pages: response.pagination.pages
      }),
      providesTags: (result) =>
        result
          ? [...result.products.map(({ _id: id }) => ({ type: 'Product', id })), 'Product']
          : ['Product']
    }),
    hasUserBoughtProduct: build.query({
      query: (productId) => ({
        url: `/products/${productId}/hasUserBought`, // Make a GET request to check if the user has bought the product
      })
    }),
    getProduct: build.query({
      query: (productId) => `/products/${productId}/`, // Make a GET request to fetch a specific product
      providesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    }),
    deleteProduct: build.mutation({
      query: (productId) => ({
        url: `/products/${productId}/`,
        method: 'DELETE' // Make a DELETE request to delete a product
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    }),
    createProduct: build.mutation({
      query: (newProduct) => ({
        url: `/products/`,
        method: 'POST', // Make a POST request to create a new product
        body: newProduct
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    }),
    updateProduct: build.mutation({
      query: (updatedProduct) => ({
        url: `/products/${updatedProduct._id}/`,
        method: 'PUT', // Make a PUT request to update a product
        body: updatedProduct
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    })
  })
});

export const {
  useListProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useHasUserBoughtProductQuery
} = productApi;
