import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { IssueDetailPanel } from './IssueDetailPanel'
import { theme } from '@/theme/muiTheme'
import type { Issue } from '@/types/analysis.types'

const mockIssues: Issue[] = [
  {
    id: 'issue_1',
    type: 'duplicate',
    severity: 'high',
    line_item_ref: '99213',
    description: 'Office visit billed twice on the same date of service.',
    estimated_savings: 250,
    action: 'Request removal of the duplicate charge in writing.',
  },
  {
    id: 'issue_2',
    type: 'unbundling',
    severity: 'medium',
    line_item_ref: null,
    description: 'Two procedures billed separately that should be bundled.',
    estimated_savings: null,
    action: 'Ask why these were not bundled.',
  },
]

function renderPanel(issues = mockIssues, totalSavings: number | null = 250) {
  return render(
    <ThemeProvider theme={theme}>
      <IssueDetailPanel issues={issues} totalSavings={totalSavings} />
    </ThemeProvider>,
  )
}

describe('IssueDetailPanel', () => {
  it('renders one accordion per issue', () => {
    renderPanel()
    expect(screen.getByText('Duplicate charge')).toBeInTheDocument()
    expect(screen.getByText('Unbundled charges')).toBeInTheDocument()
  })

  it('shows severity chips', () => {
    renderPanel()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('shows estimated savings when available', () => {
    renderPanel()
    expect(screen.getByText('~$250.00 savings')).toBeInTheDocument()
  })

  it('shows total savings chip', () => {
    renderPanel(mockIssues, 500)
    expect(screen.getByText(/Up to \$500\.00 in potential savings/)).toBeInTheDocument()
  })

  it('expands accordion to show description and action', async () => {
    renderPanel()
    await userEvent.click(screen.getByText('Duplicate charge'))
    expect(screen.getByText('Office visit billed twice on the same date of service.')).toBeVisible()
    expect(screen.getByText('Request removal of the duplicate charge in writing.')).toBeVisible()
  })
})
