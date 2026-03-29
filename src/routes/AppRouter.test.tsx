import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { AppRouter } from './AppRouter'
import { theme } from '@/theme/muiTheme'
import authReducer from '@/features/auth/authSlice'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from '@/features/auth/authApi'

function makeStore() {
  return configureStore({
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
}

function renderAt(path: string) {
  return render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[path]}>
          <AppRouter />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('AppRouter', () => {
  it('renders HomePage at /', () => {
    renderAt('/')
    expect(screen.getByText(/HomePage/i)).toBeInTheDocument()
  })

  it('renders AnalyzePage at /analyze', () => {
    renderAt('/analyze')
    expect(screen.getByText(/AnalyzePage/i)).toBeInTheDocument()
  })

  it('renders AnalyzePage at /analyze/:id', () => {
    renderAt('/analyze/some-id')
    expect(screen.getByText(/AnalyzePage/i)).toBeInTheDocument()
  })

  it('renders PaymentSuccessPage at /payment/success', () => {
    renderAt('/payment/success')
    expect(screen.getByText(/PaymentSuccessPage/i)).toBeInTheDocument()
  })

  it('renders NotFoundPage for unknown routes', () => {
    renderAt('/this-does-not-exist')
    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })
})
