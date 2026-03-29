import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { PackPage } from './PackPage'
import { theme } from '@/theme/muiTheme'
import authReducer from '@/features/auth/authSlice'
import { analysisApi } from '@/features/analysis/analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from '@/features/auth/authApi'
import type { BillPack } from '@/types/payment.types'

// Mock useMyPack so we can control pack state without Supabase
vi.mock('@/hooks/useMyPack')
import { useMyPack } from '@/hooks/useMyPack'

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth: { user: { id: 'user-1', email: 'a@b.com' } as any, session: null, loading: false },
    },
  })
}

function renderPackPage() {
  return render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <PackPage />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('PackPage', () => {
  beforeEach(() => {
    vi.mocked(useMyPack).mockReturnValue(null)
  })

  it('shows buy prompt when user has no pack', () => {
    renderPackPage()
    expect(screen.getByText("You don't have an active bill pack.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get bill pack/i })).toBeInTheDocument()
  })

  it('shows remaining credits when pack has credits left', () => {
    const pack: BillPack = { id: 'pack-1', user_id: 'user-1', total_credits: 3, used_credits: 1, active: true, created_at: '', expires_at: '' }
    vi.mocked(useMyPack).mockReturnValue(pack)
    renderPackPage()
    expect(screen.getByText('2 bills remaining')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analyze a bill/i })).toBeInTheDocument()
  })

  it('shows used-up message and buy again button when all credits exhausted', () => {
    const pack: BillPack = { id: 'pack-1', user_id: 'user-1', total_credits: 3, used_credits: 3, active: true, created_at: '', expires_at: '' }
    vi.mocked(useMyPack).mockReturnValue(pack)
    renderPackPage()
    expect(screen.getByText('0 bills remaining')).toBeInTheDocument()
    expect(screen.getByText("You've used all your credits.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get another pack/i })).toBeInTheDocument()
  })

  it('shows correct singular "bill remaining" for 1 credit', () => {
    const pack: BillPack = { id: 'pack-1', user_id: 'user-1', total_credits: 3, used_credits: 2, active: true, created_at: '', expires_at: '' }
    vi.mocked(useMyPack).mockReturnValue(pack)
    renderPackPage()
    expect(screen.getByText('1 bill remaining')).toBeInTheDocument()
  })
})
