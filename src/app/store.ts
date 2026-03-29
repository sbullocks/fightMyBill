import { configureStore } from '@reduxjs/toolkit'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from '@/features/auth/authApi'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [analysisApi.reducerPath]: analysisApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      analysisApi.middleware,
      paymentApi.middleware,
      authApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
