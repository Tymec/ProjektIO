import { api } from './api';

export const reviewApi = api.injectEndpoints({
  endpoints: (build) => ({
    listReviews: build.query({
      query: (params) => ({
        url: '/reviews/', // Make a GET request to fetch reviews
        params: {
          search: params?.keyword || '',
          ordering: `${params?.asc || false ? '' : '-'}${params?.orderBy || 'createdAt'}`,
          page: params?.page || 1
        }
      }),
      transformResponse: (response) => ({
        reviews: response.results, // Transform the response to include the reviews, page, and pages properties
        page: response.pagination.page,
        pages: response.pagination.pages
      }),
      providesTags: (result) =>
        result
          ? [...result.reviews.map(({ _id: id }) => ({ type: 'Review', id })), 'Review']
          : ['Review']
    }),
    getReview: build.query({
      query: (reviewId) => `/reviews/${reviewId}/`, // Make a GET request to fetch a specific review
      providesTags: (result) =>
        result ? [{ type: 'Review', id: result._id }, 'Review'] : ['Review']
    }),
    deleteReview: build.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/`,
        method: 'DELETE' // Make a DELETE request to delete a review
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Review', id: result._id }, 'Review'] : ['Review']
    }),
    createReview: build.mutation({
      query: (newReview) => ({
        url: `/reviews/`,
        method: 'POST', // Make a POST request to create a new review
        body: newReview
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Review', id: result._id }, 'Review'] : ['Review']
    }),
    updateReview: build.mutation({
      query: (updatedReview) => ({
        url: `/reviews/${updatedReview.id}/`,
        method: 'PUT', // Make a PUT request to update a review
        body: updatedReview
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Review', id: result._id }, 'Review'] : ['Review']
    })
  })
});

export const {
  useListReviewsQuery,
  useGetReviewQuery,
  useDeleteReviewMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation
} = reviewApi;
