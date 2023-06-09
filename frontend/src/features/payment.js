import { api } from './api';

export const paymentApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCheckoutSession: build.mutation({
      query: (args) => ({
        url: `/payments/create-checkout-session/`,
        method: 'POST',
        body: {
          cart: args.cartItems,
          redirectUrl: `http://localhost:5173/${args.path}`
        }
      })
    })
  })
});

export const { useCreateCheckoutSessionMutation } = paymentApi;
