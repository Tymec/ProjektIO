import { api } from './api'

export const reviewApi = api.injectEndpoints({
    tagTypes: ['Review'],
    endpoints: build => ({
        listReviews: build.query({
            query: params => ({
                url: "/reviews/?" + new URLSearchParams({
                    search: params?.keyword || '',
                    ordering: `${(params?.asc || false) ? '' : '-'}${params?.orderBy || 'createdAt'}`,
                    page: params?.page || 1
                })
            }),
            transformResponse: response => ({
                reviews: response.results,
                page: response.pagination.page,
                pages: response.pagination.pages
            }),
            providesTags: ['Review']
        }),
        getReview: build.query({
            query: reviewId => `/reviews/${reviewId}/`,
            providesTags: ['Review']
        }),
        deleteReview: build.mutation({
            query: reviewId => ({
                url: `/reviews/${reviewId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review']
        }),
        createReview: build.mutation({
            query: newReview => ({
                url: `/reviews/`,
                method: 'POST',
                body: newReview
            }),
            invalidatesTags: ['Review']
        }),
        updateReview: build.mutation({
            query: updatedReview => ({
                url: `/reviews/${updatedReview.id}/`,
                method: 'PUT',
                body: updatedReview
            }),
            invalidatesTags: ['Review']
        }),
    })
})

export const { useListReviewsQuery, useGetReviewQuery, useDeleteReviewMutation, useCreateReviewMutation, useUpdateReviewMutation } = reviewApi
