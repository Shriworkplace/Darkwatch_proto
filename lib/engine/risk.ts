import { Threat, Severity } from '../types'

/**
 * Computes a risk score based on the exposed fields of a threat.
 */
export function calculateRisk(threat: Threat): { score: number; severity: Severity } {
  let score = 0

  if (threat.password) score += 40
  if (threat.email) score += 10
  
  // Simulated privileged accounts logic
  if (threat.username === 'root' || threat.username === 'admin') {
      score += 30
  }

  // Cap score at 100
  score = Math.min(score, 100)

  let severity: Severity = 'LOW'
  if (score > 25) severity = 'MEDIUM'
  if (score > 50) severity = 'HIGH'
  if (score > 75) severity = 'CRITICAL'

  return { score, severity }
}
