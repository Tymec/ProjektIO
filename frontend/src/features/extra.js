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
    chatbotContextId: getFromLocalStorage('chatbotContextId', ''),
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
        body: { email }
      })
    }),
    unsubscribeNewsletter: build.mutation({
      query: (email) => ({
        url: `/extra/newsletter/unsubscribe/`,
        method: 'POST',
        body: { email }
      })
    }),
    getSubscriber: build.query({
      query: (id) => ({
        url: `/extra/newsletter/${id}/`,
        method: 'GET'
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
        }
      })
    }),
    imageList: build.query({
      query: () => ({
        url: `/extra/image/`,
        method: 'GET'
      })
    }),
    imageGet: build.query({
      query: (id) => ({
        url: `/extra/image/${id}/`,
        method: 'GET'
      })
    }),
    imageGenerate: build.mutation({
      query: (data) => ({
        url: `/extra/image/generate/`,
        method: 'POST',
        body: {
          prompt: data.prompt,
          size: data.size
        }
      })
    }),
    chat: build.mutation({
      query: (data) => ({
        url: `/extra/chat/`,
        method: 'POST',
        body: {
          message: data.userMessage,
          contextId: data.contextId,
          model: 'gpt-4',
        }
      })
    }),
    generateProduct: build.mutation({
      query: prompt => ({
        url: `/extra/product/`,
        method: 'POST',
        body: { prompt }
      })
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
