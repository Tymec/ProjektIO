import { api } from './api'

export const productApi = api.injectEndpoints({
    endpoints: build => ({
        listProducts: build.query({
            query: params => ({
                url: "/products/?" + new URLSearchParams({
                    search: params?.keyword || '',
                    ordering: `${(params?.asc || false) ? '' : '-'}${params?.orderBy || 'rating'}`,
                    page: params?.page || 1
                })
            }),
            transformResponse: response => ({
                products: response.results,
                page: response.pagination.page,
                pages: response.pagination.pages
            })
        }),
        getProduct: build.query({
            query: productId => `/products/${productId}/`
        }),
        deleteProduct: build.mutation({
            query: productId => ({
                url: `/products/${productId}/`,
                method: 'DELETE',
            })
        }),
        createProduct: build.mutation({
            query: newProduct => ({
                url: `/products/`,
                method: 'POST',
                body: newProduct
            })
        }),
        updateProduct: build.mutation({
            query: updatedProduct => ({
                url: `/products/${updatedProduct.id}/`,
                method: 'PUT',
                body: updatedProduct
            })
        }),
    })
})

export const { useListProductsQuery, useGetProductQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation } = productApi
