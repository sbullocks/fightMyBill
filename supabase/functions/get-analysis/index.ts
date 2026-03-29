import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const analysisId = url.searchParams.get('analysis_id')
  const sessionId = req.headers.get('x-session-id')

  if (!analysisId) {
    return new Response(JSON.stringify({ error: 'Missing analysis_id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data, error } = await supabase
    .from('analyses')
    .select('id, session_id, status, paid, free_data, paid_data, created_at, expires_at')
    .eq('id', analysisId)
    .single()

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Analysis not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Check if expired
  if (new Date(data.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: 'This analysis has expired' }), {
      status: 410,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Gate paid_data: only return it if paid AND session matches
  const sessionMatches = sessionId && data.session_id === sessionId
  const canSeePaidData = data.paid && sessionMatches

  const response = {
    id: data.id,
    status: data.status,
    paid: data.paid,
    free_data: data.free_data,
    paid_data: canSeePaidData ? data.paid_data : null,
    created_at: data.created_at,
    expires_at: data.expires_at,
  }

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
