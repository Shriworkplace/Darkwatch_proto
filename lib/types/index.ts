export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type IncidentStatus = 'NEW' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED'

export interface Organization {
  id: string
  user_id: string
  name: string
  domain: string
  created_at: string
}

export interface Threat {
  id: string
  source: string
  email?: string
  username?: string
  password?: string
  ip_address?: string
  breach_date?: string
  created_at: string
}

export interface AIAnalysis {
  executiveSummary: string
  businessImpact: string
  recommendedActions: string[]
}

export interface Incident {
  id: string
  organization_id: string
  threat_id: string
  risk_score: number
  severity: Severity
  status: IncidentStatus
  ai_analysis?: AIAnalysis
  created_at: string
  updated_at: string
  // Joined tables
  organizations?: Organization
  threats?: Threat
}

export interface Alert {
  id: string
  incident_id: string
  user_id: string
  message: string
  is_read: boolean
  created_at: string
}
