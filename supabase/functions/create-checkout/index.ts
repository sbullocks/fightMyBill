import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://www.fight-my-bill.com',
  'https://fight-my-bill.com',
  'http://localhost:5173',
  'http://localhost:3000',
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_ORIGINS.some((origin) => parsed.origin === origin)
  } catch {
    return false
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const sessionId = req.headers.get('x-session-id')
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session ID' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Extract authenticated user from verified JWT — user_id is never trusted from the request body
  let userId: string | null = null
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token)
    userId = user?.id ?? null
  }

  // Rate limit: max 10 checkout attempts per session per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('checkout_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .gte('created_at', oneHourAgo)

  if (count !== null && count >= 10) {
    return new Response(JSON.stringify({ error: 'Too many checkout attempts. Try again in an hour.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Ignore any user_id field in the body — it is derived from the verified JWT above
  const { analysis_id, product_type, success_url, cancel_url } = await req.json()

  if (!analysis_id || !product_type || !success_url || !cancel_url) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Allowlist product_type — reject anything unexpected rather than silently falling through
  if (product_type !== 'single' && product_type !== 'pack') {
    return new Response(JSON.stringify({ error: 'Invalid product type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Pack purchases require an authenticated user
  if (product_type === 'pack' && !userId) {
    return new Response(JSON.stringify({ error: 'Authentication required for pack purchases' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Validate redirect URLs are on an allowed origin
  if (!isAllowedUrl(success_url) || !isAllowedUrl(cancel_url)) {
    return new Response(JSON.stringify({ error: 'Invalid redirect URL' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Record this attempt before hitting Stripe
  await supabase.from('checkout_attempts').insert({ session_id: sessionId })

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  })

  const priceId = product_type === 'pack'
    ? Deno.env.get('STRIPE_PRICE_PACK')!
    : Deno.env.get('STRIPE_PRICE_SINGLE')!

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url,
      cancel_url,
      metadata: { analysis_id, session_id: sessionId, product_type, user_id: userId ?? '' },
    })

    return new Response(JSON.stringify({ checkout_url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    // Log internally; return a generic message so internal details are not exposed
    console.error('Stripe error:', err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ error: 'Payment setup failed. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
