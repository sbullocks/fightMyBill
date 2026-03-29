import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { AuthGuard } from './AuthGuard'
import authReducer from './authSlice'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from './authApi'

function makeStore(authState: { user: unknown; session: unknown; loading: boolean }) {
  return configureStore({
    reducer: {
      auth: authReducer,
      [analysisApi.reducerPath]: analysisApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (gDM) =>
      gDM().concat(analysisApi.middleware, paymentApi.middleware, authApi.middleware),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preloadedState: { auth: authState as any },
  })
}

function renderGuard(authState: { user: unknown; session: unknown; loading: boolean }) {
  return render(
    <Provider store={makeStore(authState)}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <AuthGuard>
                <div>Protected content</div>
              </AuthGuard>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('AuthGuard', () => {
  it('renders children when user is authenticated', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderGuard({ user: { id: 'user-1', email: 'a@b.com' } as any, session: null, loading: false })
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /login when no user', () => {
    renderGuard({ user: null, session: null, loading: false })
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders a spinner while loading', () => {
    renderGuard({ user: null, session: null, loading: true })
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    expect(screen.queryByText('Login page')).not.toBeInTheDocument()
  })
})
