'use server'

import { createClient } from '@/utils/supabase/server'
import { matchThreatToOrganization } from '@/lib/engine/matcher'
import { calculateRisk } from '@/lib/engine/risk'
import { analyzeIncident } from '@/lib/engine/ai'
import { Threat, Organization } from '@/lib/types'
import { revalidatePath } from 'next/cache'

/**
 * Triggers a manual scan.
 * Pulls a random simulated threat, matches it, and if it matches the user's org, creates an incident.
 */
export async function runScan() {
  const supabase = await createClient()
  
  // 1. Get current user's organizations
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: orgsData } = await supabase.from('organizations').select('*').eq('user_id', user.id)
  const organizations: Organization[] = orgsData || []

  if (organizations.length === 0) {
    return { success: false, error: 'No organizations configured to monitor. Go to Settings to add one.' }
  }

  // 2. Fetch a random threat from the database (simulating a feed pull)
  // In a real app, this would be fetching from an external API. Here we just grab from the 'threats' table.
  const { data: randomThreats } = await supabase.from('threats').select('*').limit(50)
  
  if (!randomThreats || randomThreats.length === 0) {
    return { success: false, error: 'No threats in the simulated feed database.' }
  }

  // Pick a random threat from the feed to simulate a new event
  const threat = randomThreats[Math.floor(Math.random() * randomThreats.length)] as Threat

  // 3. Run Matcher
  const matchedOrg = matchThreatToOrganization(threat, organizations)

  if (!matchedOrg) {
    // If it didn't match, return early. In a real system, millions of threats are processed and dropped.
    return { success: true, matched: false, message: 'Scan complete. No threats matched your monitored assets.' }
  }

  // 4. Run Risk Engine
  const { score, severity } = calculateRisk(threat)

  // 5. Run AI Analyst
  const aiAnalysis = await analyzeIncident(threat, matchedOrg)

  // 6. Insert Incident into Supabase
  const { data: incident, error: incidentError } = await supabase.from('incidents').insert({
    organization_id: matchedOrg.id,
    threat_id: threat.id,
    risk_score: score,
    severity: severity,
    status: 'NEW',
    ai_analysis: aiAnalysis
  }).select().single()

  if (incidentError) {
    console.error(incidentError)
    return { success: false, error: 'Failed to create incident record.' }
  }

  // 7. Fire an Alert
  await supabase.from('alerts').insert({
    incident_id: incident.id,
    user_id: user.id,
    message: `New ${severity} threat detected for ${matchedOrg.name}`,
    is_read: false
  })

  // Revalidate dashboard routes
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/incidents')

  return { 
    success: true, 
    matched: true, 
    message: `Scan complete. Found 1 matching threat for ${matchedOrg.name}.`,
    incidentId: incident.id
  }
}
