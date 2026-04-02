import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

import { STUDIO_SESSION_COOKIE, type StudioSessionClaims, verifyStudioSession } from './session.js'

export interface StudioRequestContext {
  session: StudioSessionClaims
  authType: 'service' | 'session'
}

function unauthorized(c: Context, message = 'Unauthorized') {
  return c.json({ code: 401, message }, 401)
}

function verifyServiceRequest(c: Context): StudioRequestContext | null {
  const expectedApiKey = process.env.AI_DRAMA_API_KEY?.trim()
  const providedApiKey = c.req.header('X-API-Key')?.trim()
  if (!expectedApiKey || !providedApiKey || expectedApiKey !== providedApiKey) {
    return null
  }

  const userId = c.req.header('X-Studio-User-Id')?.trim() || 'service-user'
  const workspaceId = c.req.header('X-Studio-Workspace-Id')?.trim() || userId
  const projectId = c.req.header('X-Studio-Project-Id')?.trim() || 'service-project'

  return {
    authType: 'service',
    session: {
      sub: userId,
      workspace_id: workspaceId,
      project_id: projectId,
      drama_id: 0,
      plan_id: null,
      iss: 'app',
      aud: 'studio',
      exp: Math.floor(Date.now() / 1000) + 60,
    },
  }
}

function verifyCookieSession(c: Context): StudioRequestContext | null {
  const token = getCookie(c, STUDIO_SESSION_COOKIE)
  if (!token) {
    return null
  }

  return {
    authType: 'session',
    session: verifyStudioSession(token),
  }
}

export async function requireStudioAuth(c: Context, next: Next) {
  try {
    const context = verifyServiceRequest(c) ?? verifyCookieSession(c)
    if (!context) {
      return unauthorized(c)
    }

    c.set('studioContext', context)
    await next()
  } catch (error) {
    return unauthorized(c, error instanceof Error ? error.message : 'Unauthorized')
  }
}

export function getStudioContext(c: Context): StudioRequestContext {
  const context = c.get('studioContext') as StudioRequestContext | undefined
  if (!context) {
    throw new Error('Studio auth context missing')
  }
  return context
}
