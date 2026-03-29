import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CheckoutRequest, CheckoutResponse } from '@/types/payment.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${supabaseUrl}/functions/v1`,
    prepareHeaders: (headers) => {
      const sessionId = localStorage.getItem('fmb_session_id')
      if (sessionId) headers.set('x-session-id', sessionId)
      return headers
    },
  }),
  endpoints: (builder) => ({
    createCheckout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/create-checkout',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useCreateCheckoutMutation } = paymentApi
