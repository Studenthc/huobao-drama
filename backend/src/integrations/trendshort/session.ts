import { createHmac, timingSafeEqual } from 'node:crypto'

export interface StudioSessionClaims {
  sub: string
  workspace_id: string
  project_id: string
  drama_id: number
  plan_id: string | null
  return_url?: string
  iss: 'app'
  aud: 'studio'
  exp: number
}

function toBase64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = (4 - (normalized.length % 4)) % 4
  return Buffer.from(normalized + '='.repeat(padding), 'base64')
}

function getStudioJwtSecret() {
  const secret = process.env.STUDIO_JWT_SECRET?.trim()
  if (!secret || secret.length < 16) {
    throw new Error('STUDIO_JWT_SECRET is required')
  }
  return secret
}

export function signStudioSession(claims: StudioSessionClaims) {
  const secret = getStudioJwtSecret()
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = toBase64Url(JSON.stringify(claims))
  const data = `${header}.${payload}`
  const signature = createHmac('sha256', secret).update(data).digest()
  return `${data}.${toBase64Url(signature)}`
}

export function verifyStudioSession(token: string) {
  const secret = getStudioJwtSecret()
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const [header, payload, signature] = parts
  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest()
  const actual = fromBase64Url(signature)

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error('Invalid token signature')
  }

  const claims = JSON.parse(fromBase64Url(payload).toString('utf8')) as StudioSessionClaims
  if (claims.iss !== 'app' || claims.aud !== 'studio') {
    throw new Error('Invalid token audience')
  }
  if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }

  return claims
}

export function buildSessionFromSsoClaims(claims: StudioSessionClaims): StudioSessionClaims {
  return {
    ...claims,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  }
}

export const STUDIO_SESSION_COOKIE = 'trendshort_studio_session'
