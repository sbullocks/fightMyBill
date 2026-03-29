import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { PaywallModal } from './PaywallModal'
import { theme } from '@/theme/muiTheme'
import authReducer from '@/features/auth/authSlice'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from './paymentApi'
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
  })
}

function renderModal(open = true, onClose = vi.fn()) {
  return render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <PaywallModal open={open} onClose={onClose} analysisId="test-analysis-id" />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('PaywallModal', () => {
  it('renders when open', () => {
    renderModal(true)
    expect(screen.getByText('Unlock your full analysis')).toBeInTheDocument()
  })

  it('renders both pricing cards', () => {
    renderModal(true)
    expect(screen.getByText('Unlock for $5')).toBeInTheDocument()
    expect(screen.getByText('Get 3 bills for $12')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderModal(false)
    expect(screen.queryByText('Unlock your full analysis')).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    renderModal(true, onClose)
    await userEvent.click(screen.getByLabelText('close'))
    expect(onClose).toHaveBeenCalled()
  })
})
