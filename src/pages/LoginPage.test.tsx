import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { LoginPage } from './LoginPage'
import { theme } from '@/theme/muiTheme'
import authReducer from '@/features/auth/authSlice'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from '@/features/auth/authApi'
import { supabase } from '@/lib/supabaseClient'

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [analysisApi.reducerPath]: analysisApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (gDM) =>
      gDM().concat(analysisApi.middleware, paymentApi.middleware, authApi.middleware),
    preloadedState: {
      auth: { user: null, session: null, loading: false },
    },
  })
}

function renderLoginPage() {
  return render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pack" element={<div>Pack page</div>} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('LoginPage', () => {
  it('renders the sign-in form', () => {
    renderLoginPage()
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('disables submit button when fields are empty', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })

  it('enables submit button when both fields are filled', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled()
  })

  it('renders a link to the register page', () => {
    renderLoginPage()
    expect(screen.getByText('Create one')).toBeInTheDocument()
  })

  it('shows an error banner when sign-in fails', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { data: { user: null, session: null }, error: { message: 'Invalid credentials' } } as any,
    )

    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/email/i), 'bad@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/sign in failed/i)).toBeInTheDocument()
    })
  })
})
