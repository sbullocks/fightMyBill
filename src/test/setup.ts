import '@testing-library/jest-dom'

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(),
}))

const chainable = {
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
  maybeSingle: vi.fn().mockResolvedValue({ data: null }),
}
// Make every method in the chain return chainable itself
Object.keys(chainable).forEach((k) => {
  if (k !== 'maybeSingle') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(chainable as any)[k].mockReturnValue(chainable)
  }
})

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnValue(chainable),
  },
}))
