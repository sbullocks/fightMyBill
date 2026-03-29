import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBanner } from './ErrorBanner'

describe('ErrorBanner', () => {
  it('renders the message', () => {
    render(<ErrorBanner message="Something failed" />)
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })

  it('renders default title', () => {
    render(<ErrorBanner message="err" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders a custom title', () => {
    render(<ErrorBanner message="err" title="Custom Error" />)
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })
})
