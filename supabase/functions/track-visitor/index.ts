import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

function isRateLimited(visitorId: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(visitorId)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(visitorId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }
  
  record.count++
  return false
}

function validateInput(data: unknown): { valid: boolean; error?: string; sanitized?: Record<string, unknown> } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const input = data as Record<string, unknown>
  
  // Required fields
  if (typeof input.page_path !== 'string' || input.page_path.length === 0 || input.page_path.length > 500) {
    return { valid: false, error: 'Invalid page_path' }
  }
  
  if (typeof input.visitor_id !== 'string' || input.visitor_id.length === 0 || input.visitor_id.length > 100) {
    return { valid: false, error: 'Invalid visitor_id' }
  }

  // Optional fields with validation
  const validDeviceTypes = ['desktop', 'mobile', 'tablet']
  const deviceType = input.device_type
  if (deviceType !== undefined && deviceType !== null) {
    if (typeof deviceType !== 'string' || !validDeviceTypes.includes(deviceType)) {
      return { valid: false, error: 'Invalid device_type' }
    }
  }

  const userAgent = input.user_agent
  if (userAgent !== undefined && userAgent !== null) {
    if (typeof userAgent !== 'string' || userAgent.length > 1000) {
      return { valid: false, error: 'Invalid user_agent' }
    }
  }

  const referrer = input.referrer
  if (referrer !== undefined && referrer !== null) {
    if (typeof referrer !== 'string' || referrer.length > 2000) {
      return { valid: false, error: 'Invalid referrer' }
    }
  }

  return {
    valid: true,
    sanitized: {
      page_path: input.page_path.slice(0, 500),
      visitor_id: input.visitor_id.slice(0, 100),
      device_type: deviceType || null,
      user_agent: userAgent ? String(userAgent).slice(0, 1000) : null,
      referrer: referrer ? String(referrer).slice(0, 2000) : null,
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json()
    
    // Validate input
    const validation = validateInput(body)
    if (!validation.valid) {
      console.log('Validation failed:', validation.error)
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sanitizedData = validation.sanitized!

    // Check rate limit
    if (isRateLimited(sanitizedData.visitor_id as string)) {
      console.log('Rate limited:', sanitizedData.visitor_id)
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key for inserting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert analytics data
    const { error } = await supabase
      .from('visitor_analytics')
      .insert({
        page_path: sanitizedData.page_path,
        visitor_id: sanitizedData.visitor_id,
        device_type: sanitizedData.device_type,
        user_agent: sanitizedData.user_agent,
        referrer: sanitizedData.referrer,
      })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to track visit' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Visit tracked successfully:', sanitizedData.page_path)
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
