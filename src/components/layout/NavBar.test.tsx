import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { NavBar } from './NavBar'
import { theme } from '@/theme/muiTheme'
import authReducer from '@/features/auth/authSlice'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from '@/features/auth/authApi'

function makeStore(user = null) {
  const store = configureStore({
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
    preloadedState: {
      auth: { user, session: null, loading: false },
    },
  })
  return store
}

function renderNavBar(user = null) {
  return render(
    <Provider store={makeStore(user)}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('NavBar', () => {
  it('renders "Sign In" when no user is authenticated', () => {
    renderNavBar(null)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('renders the FightMyBill brand name', () => {
    renderNavBar(null)
    expect(screen.getByText('FightMyBill')).toBeInTheDocument()
  })

  it('renders the FAQ link', () => {
    renderNavBar(null)
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument()
  })

  it('renders My Pack and Sign Out when authenticated', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderNavBar({ email: 'test@example.com' } as any)
    expect(screen.getByText('My Pack')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
  })
})
