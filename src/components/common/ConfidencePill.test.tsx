import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConfidencePill } from './ConfidencePill'

describe('ConfidencePill', () => {
  it('renders "High confidence" for high', () => {
    render(<ConfidencePill confidence="high" />)
    expect(screen.getByText('High confidence')).toBeInTheDocument()
  })

  it('renders "Medium confidence" for medium', () => {
    render(<ConfidencePill confidence="medium" />)
    expect(screen.getByText('Medium confidence')).toBeInTheDocument()
  })

  it('renders "Low confidence" for low', () => {
    render(<ConfidencePill confidence="low" />)
    expect(screen.getByText('Low confidence')).toBeInTheDocument()
  })
})
