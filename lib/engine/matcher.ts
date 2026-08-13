import { Organization, Threat } from '../types'

/**
 * Matches an incoming threat against a list of monitored organizations.
 * Returns the matching organization ID, or null if no match.
 */
export function matchThreatToOrganization(threat: Threat, organizations: Organization[]): Organization | null {
  for (const org of organizations) {
    if (threat.email && threat.email.endsWith(`@${org.domain}`)) {
      return org
    }
  }
  return null
}
