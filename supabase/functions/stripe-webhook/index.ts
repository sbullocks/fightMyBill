import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 })
  }

  const body = await req.text()
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const { analysis_id, session_id, product_type } = session.metadata ?? {}

  if (!analysis_id || !session_id) {
    return new Response('Missing metadata', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  if (product_type === 'single') {
    // Idempotency check
    const { data: existing } = await supabase
      .from('analyses')
      .select('stripe_payment_intent')
      .eq('id', analysis_id)
      .single()

    if (existing?.stripe_payment_intent === session.payment_intent) {
      return new Response(JSON.stringify({ received: true }), { status: 200 })
    }

    await supabase
      .from('analyses')
      .update({
        paid: true,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
      })
      .eq('id', analysis_id)
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
