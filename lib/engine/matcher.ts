export const extractDomain = (value: string) => {
  if (!value) return null
  const str = String(value).toLowerCase().trim()
  if (str.includes('@')) return str.split('@')[1]
  return str
}

export const matchThreatToOrg = (threat: any, org: any) => {
  const orgDomains = (org.domains || []).map((d: string) => d.toLowerCase())
  const orgEmails = (org.emails || []).map((e: string) => e.toLowerCase())
  const orgUsernames = (org.usernames || []).map((u: string) => u.toLowerCase())

  const cred = threat.credential || {}
  const entity = threat.entity || ''

  if (cred.email && orgEmails.includes(cred.email.toLowerCase())) {
    return { matched: true, reason: `Monitored email ${cred.email} found in leak` }
  }

  const entityDomain = extractDomain(entity)
  if (entityDomain && orgDomains.includes(entityDomain)) {
    return { matched: true, reason: `Domain ${entityDomain} matched leak` }
  }

  const credDomain = extractDomain(cred.email)
  if (credDomain && orgDomains.includes(credDomain)) {
    return { matched: true, reason: `Email domain ${credDomain} matched leak` }
  }

  if (cred.username && orgUsernames.includes(cred.username.toLowerCase())) {
    return { matched: true, reason: `Monitored username ${cred.username} matched leak` }
  }
  if (entity.startsWith('@') && orgUsernames.includes(entity.slice(1))) {
    return { matched: true, reason: `Monitored username ${entity.slice(1)} matched leak` }
  }

  return { matched: false, reason: null }
}

export const matchThreatToOrganizations = (threat: any, organizations: any[]) => {
  for (const org of organizations) {
    const result = matchThreatToOrg(threat, org)
    if (result.matched) {
      return { ...result, organization: org }
    }
  }
  return { matched: false, reason: null, organization: null }
}
