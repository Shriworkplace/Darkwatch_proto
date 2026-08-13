export const SEVERITY_MAP = [
  { max: 25, label: 'LOW' },
  { max: 50, label: 'MEDIUM' },
  { max: 75, label: 'HIGH' },
  { max: 100, label: 'CRITICAL' },
]

export const ADMIN_KEYWORDS = ['admin', 'root', 'superuser', 'sysadmin', 'ceo', 'founder', 'owner']

export const scoreToSeverity = (score: number) => {
  for (const band of SEVERITY_MAP) {
    if (score <= band.max) return band.label
  }
  return 'CRITICAL'
}

export const isAdminAccount = (cred: any) => {
  const haystack = `${cred.username || ''} ${cred.email || ''}`.toLowerCase()
  return ADMIN_KEYWORDS.some((kw) => haystack.includes(kw))
}

export const calculateRisk = (threat: any) => {
  let score = 0
  const factors: string[] = []
  const cred = threat.credential || {}
  const dataTypes = threat.dataTypes || []

  if (cred.password || dataTypes.includes('password')) {
    score += 40
    factors.push('Password exposed (+40)')
  }

  if (cred.email || dataTypes.includes('email')) {
    score += 10
    factors.push('Email exposed (+10)')
  }

  if (cred.phone || dataTypes.includes('phone')) {
    score += 10
    factors.push('Phone exposed (+10)')
  }

  if (isAdminAccount(cred)) {
    score += 30
    factors.push('Admin/privileged account (+30)')
  }

  const discovered = threat.discoveredAt ? new Date(threat.discoveredAt) : new Date()
  const daysAgo = (Date.now() - discovered.getTime()) / (1000 * 60 * 60 * 24)
  if (daysAgo <= 30) {
    score += 20
    factors.push('Recent breach (+20)')
  }

  const credentialCount = [cred.username, cred.email, cred.phone, cred.password].filter(Boolean).length
  if (credentialCount >= 2) {
    score += 20
    factors.push('Multiple credentials exposed (+20)')
  }

  score = Math.min(score, 100)

  return {
    score,
    severity: scoreToSeverity(score),
    factors,
  }
}
