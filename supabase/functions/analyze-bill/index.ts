import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `You are an expert medical billing auditor with comprehensive knowledge of:
- CPT (Current Procedural Terminology) codes and their plain-English descriptions
- ICD-10 diagnosis codes
- Revenue codes, UB-04 and CMS-1500 claim forms
- Medicare and Medicaid fee schedules
- Common medical billing errors: duplicate charges, upcoding (billing for a more expensive service than performed), unbundling (splitting one procedure into multiple billed items), incorrect modifiers, balance billing violations, and inflated facility fees

Your task is to analyze a medical bill and return a structured JSON analysis.

Rules:
1. Decode every line item into plain English that a non-medical person can understand
2. Identify all potential billing errors or overcharges
3. Write a personalized negotiation letter the patient can send to the billing department
4. Return ONLY valid JSON — no text, no markdown, no explanation before or after the JSON object
5. If the content is not a medical bill or is unreadable, return valid JSON with issue_count: 0, empty line_items, and a parse_warnings entry explaining the problem
6. For negotiation_letter.placeholders, list every field the patient needs to fill in, e.g. ["[YOUR FULL NAME]", "[TODAY'S DATE]", "[ACCOUNT NUMBER]"]
7. For estimated_savings, provide a conservative dollar estimate or null if uncertain
8. Set confidence to "high" if the bill was clearly readable, "medium" if some items were ambiguous, "low" if significant portions were unreadable

Return exactly this JSON structure:
{
  "free_data": {
    "provider_name": "string",
    "bill_date": "string or null",
    "total_billed": number or null,
    "total_due": number or null,
    "currency": "USD",
    "line_items": [
      {
        "description": "string",
        "cpt_code": "string or null",
        "billed_amount": number or null,
        "adjusted_amount": number or null,
        "patient_responsibility": number or null,
        "plain_english": "string — explain this charge in one sentence for a non-medical person"
      }
    ],
    "issue_count": number,
    "confidence": "high" | "medium" | "low",
    "parse_warnings": []
  },
  "paid_data": {
    "issues": [
      {
        "id": "issue_1",
        "type": "duplicate" | "upcoding" | "unbundling" | "incorrect_modifier" | "balance_billing" | "itemization_error" | "other",
        "severity": "high" | "medium" | "low",
        "line_item_ref": "string or null",
        "description": "string — explain the issue clearly",
        "estimated_savings": number or null,
        "action": "string — what the patient should say or do"
      }
    ],
    "total_estimated_savings": number or null,
    "negotiation_letter": {
      "subject": "string",
      "body": "string — a professional, firm letter addressed to the billing department referencing specific charges",
      "placeholders": ["[YOUR FULL NAME]", "[TODAY'S DATE]"]
    },
    "negotiation_tips": [
      "string — practical tip for negotiating this specific bill"
    ]
  }
}`

serve(async (req) => {
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

  // Rate limit: max 3 analyses per session per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .gte('created_at', oneHourAgo)

  if (count !== null && count >= 3) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again in an hour.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Parse request
  let billText = ''
  let imageBase64 = ''
  let imageMediaType = ''

  try {
    const formData = await req.formData()
    const billType = formData.get('bill_type') as string

    if (billType === 'text') {
      billText = (formData.get('text') as string) ?? ''
    } else if (billType === 'image') {
      const file = formData.get('file') as File
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ''
      for (const byte of bytes) binary += String.fromCharCode(byte)
      imageBase64 = btoa(binary)
      imageMediaType = file.type
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request format' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!billText && !imageBase64) {
    return new Response(JSON.stringify({ error: 'No bill content provided' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (billText.length > 50_000) {
    return new Response(JSON.stringify({ error: 'Bill text exceeds maximum length' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Build Claude message content
  type ContentBlock =
    | { type: 'text'; text: string }
    | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }

  const userContent: ContentBlock[] = imageBase64
    ? [
        { type: 'image', source: { type: 'base64', media_type: imageMediaType, data: imageBase64 } },
        { type: 'text', text: 'Analyze this medical bill image and return the JSON analysis.' },
      ]
    : [{ type: 'text', text: `Analyze this medical bill:\n\n${billText}` }]

  // Call Claude
  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!claudeRes.ok) {
    return new Response(JSON.stringify({ error: 'Analysis service unavailable. Please try again.' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const claudeData = await claudeRes.json()
  const rawText: string = claudeData.content?.[0]?.text ?? ''

  // Parse JSON from Claude response
  let analysis: { free_data: unknown; paid_data: unknown }
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    analysis = JSON.parse(jsonMatch[0])
  } catch {
    await supabase.from('analyses').insert({ session_id: sessionId, status: 'failed', free_data: null, paid_data: null })
    return new Response(JSON.stringify({ error: 'Failed to parse bill. Try pasting the text instead.' }), {
      status: 422,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Store result — raw bill is never persisted
  const { data, error } = await supabase
    .from('analyses')
    .insert({
      session_id: sessionId,
      status: 'complete',
      paid: false,
      free_data: analysis.free_data,
      paid_data: analysis.paid_data,
    })
    .select('id, status, free_data')
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to store analysis' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
