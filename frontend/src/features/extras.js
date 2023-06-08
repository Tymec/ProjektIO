import { api } from './api'

export const extrasApi = api.injectEndpoints({
    endpoints: build => ({
        registerNewsletter: build.mutation({
            query: email => ({
                url: `/extras/newsletter/`,
                method: 'POST',
                body: { email }
            }),
        }),
        chat: build.mutation({
            query: message => ({
                url: `/extras/chat/`,
                method: 'POST',
                body: { message }
            }),
        }),
    })
})

export const {
    useRegisterNewsletterMutation,
    useChatMutation,
} = extrasApi
