import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the user's organization(s)
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .eq('user_id', userData.user.id)

    if (!orgs || orgs.length === 0) {
      return new NextResponse('No organizations found', { status: 404 })
    }

    const orgIds = orgs.map(o => o.id)

    // Fetch incidents for these organizations
    const { data: incidents, error: incidentsError } = await supabase
      .from('incidents')
      .select(`
        id,
        risk_score,
        severity,
        status,
        created_at,
        threats (
          source,
          ip_address,
          email,
          username
        )
      `)
      .in('organization_id', orgIds)
      .order('created_at', { ascending: false })

    if (incidentsError) {
      throw incidentsError
    }

    // Convert to CSV
    const headers = ['Incident ID', 'Severity', 'Risk Score', 'Status', 'Date', 'Threat Source', 'Compromised Data']
    
    const rows = (incidents || []).map(inc => {
      const t = inc.threats as any
      const compromised = [t.email, t.username, t.ip_address].filter(Boolean).join(', ')
      
      return [
        inc.id,
        inc.severity,
        inc.risk_score,
        inc.status,
        new Date(inc.created_at).toLocaleString(),
        `"${t.source}"`,
        `"${compromised}"`
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="darkwatch_incidents_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

  } catch (err: any) {
    console.error('Export Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
