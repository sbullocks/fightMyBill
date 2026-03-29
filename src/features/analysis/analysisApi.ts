import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Analysis } from '@/types/analysis.types'
import type { RootState } from '@/app/store'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const analysisApi = createApi({
  reducerPath: 'analysisApi',
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
  tagTypes: ['Analysis'],
  endpoints: (builder) => ({
    submitBill: builder.mutation<Pick<Analysis, 'id' | 'status' | 'free_data'>, FormData>({
      query: (formData) => ({
        url: '/analyze-bill',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, _arg) => [{ type: 'Analysis' }],
    }),
    getAnalysis: builder.query<Analysis, string>({
      query: (analysisId) => `/get-analysis?analysis_id=${analysisId}`,
      providesTags: (_result, _error, id) => [{ type: 'Analysis', id }],
    }),
    pollAnalysis: builder.query<Analysis, string>({
      query: (analysisId) => `/get-analysis?analysis_id=${analysisId}`,
    }),
  }),
})

export const { useSubmitBillMutation, useGetAnalysisQuery, usePollAnalysisQuery } = analysisApi
