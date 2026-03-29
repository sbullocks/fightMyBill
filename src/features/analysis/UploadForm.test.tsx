import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { UploadForm } from './UploadForm'
import { theme } from '@/theme/muiTheme'
import authReducer from '@/features/auth/authSlice'
import { analysisApi } from './analysisApi'
import { paymentApi } from '@/features/payment/paymentApi'
import { authApi } from '@/features/auth/authApi'

vi.mock('@/utils/extractTextFromPdf', () => ({
  extractTextFromPdf: vi.fn().mockResolvedValue('mock extracted bill text content'),
}))

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

function renderForm() {
  return render(
    <Provider store={makeStore()}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <UploadForm />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )
}

describe('UploadForm', () => {
  it('renders the upload form with both tabs', () => {
    renderForm()
    expect(screen.getByText('Upload file')).toBeInTheDocument()
    expect(screen.getByText('Paste text')).toBeInTheDocument()
  })

  it('disables submit button when no file is selected on upload tab', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /analyze my bill/i })).toBeDisabled()
  })

  it('disables submit button when paste text is too short', async () => {
    renderForm()
    await userEvent.click(screen.getByText('Paste text'))
    const textarea = screen.getByPlaceholderText(/paste your bill text/i)
    await userEvent.type(textarea, 'short')
    expect(screen.getByRole('button', { name: /analyze my bill/i })).toBeDisabled()
  })

  it('enables submit button when paste text is long enough', async () => {
    renderForm()
    await userEvent.click(screen.getByText('Paste text'))
    const textarea = screen.getByPlaceholderText(/paste your bill text/i)
    await userEvent.type(textarea, 'a'.repeat(51))
    expect(screen.getByRole('button', { name: /analyze my bill/i })).not.toBeDisabled()
  })

  it('shows error when non-accepted file type is selected', () => {
    renderForm()
    const file = new File(['content'], 'doc.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)
    expect(screen.getByText(/only pdf, jpg, and png/i)).toBeInTheDocument()
  })

  it('shows file name after valid file is selected', () => {
    renderForm()
    const file = new File(['content'], 'my-bill.pdf', { type: 'application/pdf' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)
    expect(screen.getByText('my-bill.pdf')).toBeInTheDocument()
  })
})
