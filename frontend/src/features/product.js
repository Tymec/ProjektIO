import { api } from './api';

export const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    listProducts: build.query({
      query: (params) => ({
        url:
          '/products/?' +
          new URLSearchParams({
            search: params?.keyword || '',
            ordering: `${params?.asc || false ? '' : '-'}${params?.orderBy || 'rating'}`,
            page: params?.page || 1,
            ids: params?.ids || ''
          })
      }),
      transformResponse: (response) => ({
        products: response.results,
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
        url: `/products/${productId}/hasUserBought`
      })
    }),
    getProduct: build.query({
      query: (productId) => `/products/${productId}/`,
      providesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    }),
    deleteProduct: build.mutation({
      query: (productId) => ({
        url: `/products/${productId}/`,
        method: 'DELETE'
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    }),
    createProduct: build.mutation({
      query: (newProduct) => ({
        url: `/products/`,
        method: 'POST',
        body: newProduct
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Product', id: result._id }, 'Product'] : ['Product']
    }),
    updateProduct: build.mutation({
      query: (updatedProduct) => ({
        url: `/products/${updatedProduct._id}/`,
        method: 'PUT',
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
