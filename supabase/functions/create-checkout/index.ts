// Phase 3 — create-checkout Edge Function
// Creates a Stripe Checkout Session and returns the URL

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (_req) => {
  return new Response(JSON.stringify({ message: 'create-checkout — not yet implemented' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
