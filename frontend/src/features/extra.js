import { api } from './api';

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
          model: 'gpt-4'
        }
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
  useChatMutation
} = extraApi;
