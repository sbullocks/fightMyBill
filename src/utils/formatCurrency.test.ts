import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formats a positive number as USD', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('returns em dash for null', () => {
    expect(formatCurrency(null)).toBe('—')
  })

  it('returns em dash for undefined', () => {
    expect(formatCurrency(undefined as unknown as null)).toBe('—')
  })

  it('formats large amounts with comma separators', () => {
    expect(formatCurrency(10000)).toBe('$10,000.00')
  })
})
