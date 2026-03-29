import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { PricingCards } from './PricingCards'
import { theme } from '@/theme/muiTheme'

function renderCards(onSelect = vi.fn(), isLoading = false) {
  return render(
    <ThemeProvider theme={theme}>
      <PricingCards onSelect={onSelect} isLoading={isLoading} />
    </ThemeProvider>,
  )
}

describe('PricingCards', () => {
  it('renders both pricing options', () => {
    renderCards()
    expect(screen.getByText('Unlock for $5')).toBeInTheDocument()
    expect(screen.getByText('Get 3 bills for $12')).toBeInTheDocument()
  })

  it('calls onSelect with "single" when single button clicked', async () => {
    const onSelect = vi.fn()
    renderCards(onSelect)
    await userEvent.click(screen.getByText('Unlock for $5'))
    expect(onSelect).toHaveBeenCalledWith('single')
  })

  it('calls onSelect with "pack" when pack button clicked', async () => {
    const onSelect = vi.fn()
    renderCards(onSelect)
    await userEvent.click(screen.getByText('Get 3 bills for $12'))
    expect(onSelect).toHaveBeenCalledWith('pack')
  })

  it('disables buttons when isLoading is true', () => {
    renderCards(vi.fn(), true)
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})
