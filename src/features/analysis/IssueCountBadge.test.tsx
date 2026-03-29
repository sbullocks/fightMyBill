import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { IssueCountBadge } from './IssueCountBadge'
import { theme } from '@/theme/muiTheme'

function renderBadge(count: number, onUnlock?: () => void) {
  return render(
    <ThemeProvider theme={theme}>
      <IssueCountBadge count={count} onUnlock={onUnlock} />
    </ThemeProvider>,
  )
}

describe('IssueCountBadge', () => {
  it('shows correct count for multiple issues', () => {
    renderBadge(3)
    expect(screen.getByText('3 potential issues detected')).toBeInTheDocument()
  })

  it('uses singular for exactly 1 issue', () => {
    renderBadge(1)
    expect(screen.getByText('1 potential issue detected')).toBeInTheDocument()
  })

  it('shows clean bill message for 0 issues', () => {
    renderBadge(0)
    expect(screen.getByText('No issues detected')).toBeInTheDocument()
  })

  it('shows unlock button when onUnlock is provided', () => {
    renderBadge(2, vi.fn())
    expect(screen.getByRole('button', { name: /unlock/i })).toBeInTheDocument()
  })

  it('does not show unlock button when onUnlock is not provided', () => {
    renderBadge(2)
    expect(screen.queryByRole('button', { name: /unlock/i })).not.toBeInTheDocument()
  })

  it('calls onUnlock when button is clicked', async () => {
    const onUnlock = vi.fn()
    renderBadge(2, onUnlock)
    await userEvent.click(screen.getByRole('button', { name: /unlock/i }))
    expect(onUnlock).toHaveBeenCalledOnce()
  })
})
