// Phase 3 — stripe-webhook Edge Function
// Validates Stripe signature, marks analysis as paid or activates bill pack

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (_req) => {
  return new Response(JSON.stringify({ message: 'stripe-webhook — not yet implemented' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
