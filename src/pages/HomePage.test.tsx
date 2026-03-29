import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { HomePage } from './HomePage'
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
    middleware: (gDM) => gDM().concat(analysisApi.middleware, paymentApi.middleware, authApi.middleware),
    preloadedState: { auth: { user: null, session: null, loading: false } },
  })
}

function renderHome() {
  return render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('HomePage', () => {
  it('renders the hero headline', () => {
    renderHome()
    expect(screen.getByText(/stop overpaying your medical bills/i)).toBeInTheDocument()
  })

  it('renders the three how-it-works steps', () => {
    renderHome()
    expect(screen.getByText('STEP 1')).toBeInTheDocument()
    expect(screen.getByText('STEP 2')).toBeInTheDocument()
    expect(screen.getByText('STEP 3')).toBeInTheDocument()
  })

  it('renders the pricing section', () => {
    renderHome()
    expect(screen.getByText('Simple pricing')).toBeInTheDocument()
    expect(screen.getByText('$5')).toBeInTheDocument()
    expect(screen.getByText('$12')).toBeInTheDocument()
  })

  it('renders at least two CTA links to /analyze', () => {
    renderHome()
    const analyzeLinks = screen.getAllByRole('link', { name: /analyze my bill/i })
    expect(analyzeLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the trust signals bar', () => {
    renderHome()
    expect(screen.getByText('Raw bill never stored')).toBeInTheDocument()
    expect(screen.getByText('No account required for a single bill')).toBeInTheDocument()
  })
})
