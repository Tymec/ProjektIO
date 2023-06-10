import { createSlice } from '@reduxjs/toolkit';

import { api } from './api';

const getFromLocalStorage = (key, def = '') => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return def;
};

export const extraSlice = createSlice({
  name: 'extra',
  initialState: {
    chatbotContextId: getFromLocalStorage('chatbotContextId', '')
  },
  reducers: {
    setChatbotContextId: (state, action) => {
      state.chatbotContextId = action.payload;
      localStorage.setItem('chatbotContextId', JSON.stringify(state.chatbotContextId));
    },
    resetChatbotContextId: (state) => {
      state.chatbotContextId = '';
      localStorage.removeItem('chatbotContextId');
    }
  }
});

export const { setChatbotContextId, resetChatbotContextId } = extraSlice.actions;

export const extraApi = api.injectEndpoints({
  endpoints: (build) => ({
    subscribeNewsletter: build.mutation({
      query: (email) => ({
        url: `/extra/newsletter/subscribe/`,
        method: 'POST',
        body: { email } // Pass the email in the request body
      })
    }),
    unsubscribeNewsletter: build.mutation({
      query: (email) => ({
        url: `/extra/newsletter/unsubscribe/`,
        method: 'POST',
        body: { email } // Pass the email in the request body
      })
    }),
    getSubscriber: build.query({
      query: (id) => ({
        url: `/extra/newsletter/${id}/`,
        method: 'GET' // Make a GET request to retrieve subscriber data with the specified ID
      })
    }),
    sendNewsletter: build.mutation({
      query: (data) => ({
        url: `/extra/newsletter/send/`,
        method: 'POST',
        body: {
          subject: data.subject,
          template: 'basic',
          content: {
            title: data.title,
            description: data.description,
            image_url: data.image_url,
            content: data.message,
            link: data.link,
            unsubscribe_url: `${window.location.origin}/newsletter/unsubscribe/me`
          }
        } // Pass the newsletter data in the request body
      })
    }),
    imageList: build.query({
      query: () => ({
        url: `/extra/image/`,
        method: 'GET' // Make a GET request to retrieve a list of images
      })
    }),
    imageGet: build.query({
      query: (id) => ({
        url: `/extra/image/${id}/`,
        method: 'GET' // Make a GET request to retrieve an image with the specified ID
      })
    }),
    imageGenerate: build.mutation({
      query: (data) => ({
        url: `/extra/image/generate/`,
        method: 'POST',
        body: {
          prompt: data.prompt,
          size: data.size
        } // Pass the prompt and size in the request body for image generation
      })
    }),
    chat: build.mutation({
      query: (data) => ({
        url: `/extra/chat/`,
        method: 'POST',
        body: {
          message: data.userMessage,
          contextId: data.contextId,
          model: 'gpt-4'
        } // Pass the chat message, context ID, and model in the request body for chat functionality
      })
    }),
    generateProduct: build.mutation({
      query: (prompt) => ({
        url: `/extra/product/`,
        method: 'POST',
        body: { prompt }
      }),
      invalidatesTags: ['Product']
    })
  })
});

export const {
  useSubscribeNewsletterMutation,
  useUnsubscribeNewsletterMutation,
  useGetSubscriberQuery,
  useSendNewsletterMutation,
  useImageListQuery,
  useImageGetQuery,
  useImageGenerateMutation,
  useChatMutation,
  useGenerateProductMutation
} = extraApi;
