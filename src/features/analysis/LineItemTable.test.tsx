import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { LineItemTable } from './LineItemTable'
import { theme } from '@/theme/muiTheme'
import type { LineItem } from '@/types/analysis.types'

const mockItems: LineItem[] = [
  {
    description: 'Office Visit',
    cpt_code: '99213',
    billed_amount: 250,
    adjusted_amount: 180,
    patient_responsibility: 50,
    plain_english: 'A standard doctor office visit for an established patient.',
  },
  {
    description: 'Blood Draw',
    cpt_code: '36415',
    billed_amount: null,
    adjusted_amount: null,
    patient_responsibility: null,
    plain_english: 'Collecting a blood sample for lab testing.',
  },
]

function renderTable(items: LineItem[]) {
  return render(
    <ThemeProvider theme={theme}>
      <LineItemTable lineItems={items} />
    </ThemeProvider>,
  )
}

describe('LineItemTable', () => {
  it('renders the correct number of rows', () => {
    renderTable(mockItems)
    expect(screen.getByText('Office Visit')).toBeInTheDocument()
    expect(screen.getByText('Blood Draw')).toBeInTheDocument()
  })

  it('renders plain English descriptions', () => {
    renderTable(mockItems)
    expect(screen.getByText('A standard doctor office visit for an established patient.')).toBeInTheDocument()
  })

  it('renders CPT code chips', () => {
    renderTable(mockItems)
    expect(screen.getByText('CPT 99213')).toBeInTheDocument()
  })

  it('renders formatted currency amounts', () => {
    renderTable(mockItems)
    expect(screen.getByText('$250.00')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('renders em dash for null amounts', () => {
    renderTable(mockItems)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('renders empty table without crashing', () => {
    renderTable([])
    expect(screen.getByText('Your charges, decoded')).toBeInTheDocument()
  })
})
