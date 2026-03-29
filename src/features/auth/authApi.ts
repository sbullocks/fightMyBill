import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

interface AuthCredentials {
  email: string
  password: string
}

interface AuthResult {
  user: User | null
  session: Session | null
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResult, AuthCredentials>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: { user: data.user, session: data.session } }
      },
    }),
    signIn: builder.mutation<AuthResult, AuthCredentials>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: { user: data.user, session: data.session } }
      },
    }),
    signOut: builder.mutation<void, void>({
      queryFn: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return { data: undefined }
      },
    }),
    getSession: builder.query<AuthResult, void>({
      queryFn: async () => {
        const { data, error } = await supabase.auth.getSession()
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } }
        return {
          data: {
            user: data.session?.user ?? null,
            session: data.session,
          },
        }
      },
    }),
  }),
})

export const { useSignUpMutation, useSignInMutation, useSignOutMutation, useGetSessionQuery } =
  authApi
