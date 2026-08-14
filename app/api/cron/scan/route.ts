import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { matchThreatToOrganization } from '@/lib/engine/matcher'
import { calculateRisk } from '@/lib/engine/risk'
import { analyzeIncident } from '@/lib/engine/ai'
import { Threat, Organization } from '@/lib/types'

// This cron job uses the service role key to bypass RLS and process all orgs
export async function GET(request: Request) {
  // Validate cron secret if deployed
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    // We MUST use the service_role key to bypass RLS for a background job,
    // otherwise it won't be able to read organizations for users who aren't logged in.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
       console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Global cron job cannot run.')
       return NextResponse.json({ error: 'Missing service key' }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Fetch all organizations
    const { data: orgsData, error: orgsError } = await supabaseAdmin.from('organizations').select('*')
    if (orgsError) throw orgsError

    const organizations: Organization[] = orgsData || []
    if (organizations.length === 0) {
      return NextResponse.json({ message: 'No organizations to monitor.' })
    }

    // 2. Fetch recent threats that haven't been matched yet
    // For simplicity in this demo, we'll grab the latest 100 threats
    const { data: threatsData, error: threatsError } = await supabaseAdmin
      .from('threats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (threatsError) throw threatsError
    const threats: Threat[] = threatsData || []
    
    let newIncidentsCount = 0

    // 3. Process matches
    for (const threat of threats) {
      const matchedOrg = matchThreatToOrganization(threat, organizations)
      
      if (matchedOrg) {
        // Check if incident already exists to avoid duplicates
        const { data: existing } = await supabaseAdmin
          .from('incidents')
          .select('id')
          .eq('threat_id', threat.id)
          .eq('organization_id', matchedOrg.id)
          .single()
          
        if (!existing) {
          const { score, severity } = calculateRisk(threat)
          const aiAnalysis = await analyzeIncident(threat, matchedOrg)
          
          const { data: incident } = await supabaseAdmin.from('incidents').insert({
            organization_id: matchedOrg.id,
            threat_id: threat.id,
            risk_score: score,
            severity: severity,
            status: 'NEW',
            ai_analysis: aiAnalysis
          }).select().single()
          
          if (incident) {
            newIncidentsCount++
            // Create alert
            await supabaseAdmin.from('alerts').insert({
              incident_id: incident.id,
              user_id: matchedOrg.user_id, // Route alert to the org owner
              message: `New ${severity} threat detected for ${matchedOrg.name}`,
              is_read: false
            })

            // Dispatch webhook if severity is CRITICAL
            if (severity === 'CRITICAL') {
              const { dispatchWebhookAlert } = await import('@/lib/notifications/webhook')
              await dispatchWebhookAlert(process.env.SLACK_WEBHOOK_URL, incident, matchedOrg.name)
            }
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron job complete. Created ${newIncidentsCount} new incidents.` 
    })
    
  } catch (err: any) {
    console.error('Cron Error:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 })
  }
}
