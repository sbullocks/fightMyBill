import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSessionId } from './useSessionId'

const SESSION_KEY = 'fmb_session_id'

describe('useSessionId', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('generates a valid UUID on first call', () => {
    const { result } = renderHook(() => useSessionId())
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(result.current).toMatch(uuidRegex)
  })

  it('persists the UUID to localStorage on first call', () => {
    const { result } = renderHook(() => useSessionId())
    expect(localStorage.getItem(SESSION_KEY)).toBe(result.current)
  })

  it('returns the same UUID on subsequent renders', () => {
    const { result, rerender } = renderHook(() => useSessionId())
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('returns the existing UUID if one is already in localStorage', () => {
    const existing = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, existing)
    const { result } = renderHook(() => useSessionId())
    expect(result.current).toBe(existing)
  })
})
