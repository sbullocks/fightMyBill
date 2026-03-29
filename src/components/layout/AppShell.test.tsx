import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { AppShell } from './AppShell'
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

describe('AppShell', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={makeStore()}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <AppShell>
              <div>test child</div>
            </AppShell>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )
    expect(screen.getByText('test child')).toBeInTheDocument()
  })

  it('renders NavBar and Footer', () => {
    render(
      <Provider store={makeStore()}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <AppShell>
              <div />
            </AppShell>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>,
    )
    expect(screen.getByText('FightMyBill')).toBeInTheDocument()
    expect(screen.getByText(/FightMyBill provides informational analysis only/i)).toBeInTheDocument()
  })
})
