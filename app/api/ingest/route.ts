import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Threat } from '@/lib/types'

// Note: In a real app, this endpoint would be protected by an API key or Webhook secret.
// For this simulation, we'll allow unauthenticated POSTs to easily inject mock data.

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)
    
    const body = await request.json()
    
    // Expecting an array of threats, or a single threat
    const threatsArray = Array.isArray(body) ? body : [body]
    
    if (threatsArray.length === 0) {
      return NextResponse.json({ error: 'No threats provided' }, { status: 400 })
    }

    // Map the incoming payload to match the DB schema
    const formattedThreats = threatsArray.map((t: any) => ({
      source: t.source || 'Unknown Source',
      email: t.email || null,
      username: t.username || null,
      password: t.password || null,
      ip_address: t.ip_address || null,
      breach_date: t.breach_date || new Date().toISOString(),
    }))

    const { data, error } = await supabaseAdmin
      .from('threats')
      .insert(formattedThreats)
      .select()

    if (error) {
      console.error('Ingestion Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully ingested ${data.length} threats.`,
      data 
    })
    
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
