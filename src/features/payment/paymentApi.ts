import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CheckoutRequest, CheckoutResponse } from '@/types/payment.types'
import type { RootState } from '@/app/store'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${supabaseUrl}/functions/v1`,
    prepareHeaders: (headers, { getState }) => {
      const session = (getState() as RootState).auth.session
      headers.set('apikey', supabaseAnonKey)
      headers.set('Authorization', `Bearer ${session?.access_token ?? supabaseAnonKey}`)
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
