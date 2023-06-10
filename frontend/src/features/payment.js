import { api } from './api';

export const paymentApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCheckoutSession: build.mutation({
      query: (args) => ({
        url: `/payments/create-checkout-session/`, // Make a POST request to create a checkout session
        method: 'POST',
        body: {
          cart: args.cartItems,
          redirectUrl: `http://localhost:5173/${args.path}` // Pass the cart items and redirect URL in the request body
        }
      })
    })
  })
});

export const { useCreateCheckoutSessionMutation } = paymentApi;
