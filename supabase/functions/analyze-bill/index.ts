// Phase 2 — analyze-bill Edge Function
// Receives bill text/image, calls Claude, stores result, returns free_data

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (_req) => {
  return new Response(JSON.stringify({ message: 'analyze-bill — not yet implemented' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
