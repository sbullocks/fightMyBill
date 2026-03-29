import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { FaqPage } from './FaqPage'
import { theme } from '@/theme/muiTheme'

function renderFaq() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('FaqPage', () => {
  it('renders the page heading', () => {
    renderFaq()
    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument()
  })

  it('renders all FAQ questions', () => {
    renderFaq()
    expect(screen.getByText(/how does the analysis work/i)).toBeInTheDocument()
    expect(screen.getByText(/is my bill information secure/i)).toBeInTheDocument()
    expect(screen.getByText(/do i need an account/i)).toBeInTheDocument()
  })

  it('answers are not visible by default', () => {
    renderFaq()
    // MUI Accordion keeps content in DOM but hides it — check visibility
    expect(screen.getByText(/your raw bill — the pdf, image/i)).not.toBeVisible()
  })

  it('expands an answer when clicked', async () => {
    renderFaq()
    await userEvent.click(screen.getByText(/is my bill information secure/i))
    expect(screen.getByText(/your raw bill — the pdf, image/i)).toBeVisible()
  })

  it('collapses the answer when clicked again', async () => {
    renderFaq()
    const question = screen.getByText(/is my bill information secure/i)
    await userEvent.click(question)
    await userEvent.click(question)
    expect(screen.getByText(/your raw bill — the pdf, image/i)).not.toBeVisible()
  })

  it('renders a CTA link to /analyze', () => {
    renderFaq()
    expect(screen.getByRole('link', { name: /analyze my bill/i })).toBeInTheDocument()
  })
})
