import { useEffect, useState } from 'react'

const SESSION_KEY = 'fmb_session_id'

function generateUUID(): string {
  return crypto.randomUUID()
}

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>(() => {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const fresh = generateUUID()
    localStorage.setItem(SESSION_KEY, fresh)
    return fresh
  })

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) {
      const fresh = generateUUID()
      localStorage.setItem(SESSION_KEY, fresh)
      setSessionId(fresh)
    }
  }, [])

  return sessionId
}
