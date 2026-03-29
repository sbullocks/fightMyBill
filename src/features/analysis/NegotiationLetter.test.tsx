import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { NegotiationLetter } from './NegotiationLetter'
import { theme } from '@/theme/muiTheme'
import type { NegotiationLetter as NegotiationLetterType } from '@/types/analysis.types'

const mockLetter: NegotiationLetterType = {
  subject: 'Dispute of charges — Account [ACCOUNT NUMBER]',
  body: 'Dear Billing Department,\n\nMy name is [YOUR FULL NAME] and I am writing to dispute charges on my bill dated [DATE].\n\nSincerely,\n[YOUR FULL NAME]',
  placeholders: ['[YOUR FULL NAME]', '[DATE]', '[ACCOUNT NUMBER]'],
}

function renderLetter(letter = mockLetter) {
  return render(
    <ThemeProvider theme={theme}>
      <NegotiationLetter letter={letter} />
    </ThemeProvider>,
  )
}

describe('NegotiationLetter', () => {
  it('renders the letter subject', () => {
    renderLetter()
    expect(screen.getByText(/Dispute of charges/)).toBeInTheDocument()
  })

  it('renders the letter body', () => {
    renderLetter()
    expect(screen.getByText(/Dear Billing Department/)).toBeInTheDocument()
  })

  it('renders highlighted placeholders', () => {
    renderLetter()
    const placeholders = screen.getAllByText('[YOUR FULL NAME]')
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('shows placeholder warning when placeholders exist', () => {
    renderLetter()
    expect(screen.getByText(/Fill in the highlighted sections/i)).toBeInTheDocument()
  })

  it('renders copy button', () => {
    renderLetter()
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })
})
