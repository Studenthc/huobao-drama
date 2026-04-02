import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { eq } from 'drizzle-orm'

import { db, schema } from '../../db/index.js'
import { getStudioContext, requireStudioAuth } from './auth.js'
import { badRequest, success } from '../../utils/response.js'
import {
  STUDIO_SESSION_COOKIE,
  buildSessionFromSsoClaims,
  signStudioSession,
  verifyStudioSession,
} from './session.js'

const app = new Hono()

function normalizeLegacyPath(nextPath: string | null | undefined, fallbackDramaId: number) {
  if (!nextPath?.trim()) {
    return `/drama/${fallbackDramaId}`
  }

  const trimmed = nextPath.trim()
  const dramaEpisodeMatch = trimmed.match(/^\/dramas\/(\d+)\/episode\/(\d+)(?:\/professional)?$/)
  if (dramaEpisodeMatch) {
    return `/drama/${dramaEpisodeMatch[1]}/episode/${dramaEpisodeMatch[2]}`
  }

  const dramaMatch = trimmed.match(/^\/dramas\/(\d+)(?:\/settings)?$/)
  if (dramaMatch) {
    return `/drama/${dramaMatch[1]}`
  }

  const episodeMatch = trimmed.match(/^\/episodes\/(\d+)(?:\/edit|\/storyboard)?$/) || trimmed.match(/^\/timeline\/(\d+)$/)
  if (episodeMatch) {
    const episodeId = Number(episodeMatch[1])
    const [episode] = db.select().from(schema.episodes).where(eq(schema.episodes.id, episodeId)).all()
    if (episode) {
      return `/drama/${episode.dramaId}/episode/${episode.episodeNumber}`
    }
  }

  if (/^\/drama\/\d+(?:\/episode\/\d+)?$/.test(trimmed)) {
    return trimmed
  }

  return `/drama/${fallbackDramaId}`
}

app.post('/sso/exchange', async (c) => {
  const body = await c.req.json().catch(() => null) as { token?: string; next?: string | null } | null
  if (!body?.token) {
    return badRequest(c, 'token is required')
  }

  let claims
  try {
    claims = verifyStudioSession(body.token)
  } catch (error) {
    return c.json({ code: 401, message: error instanceof Error ? error.message : 'Invalid token' }, 401)
  }

  const session = buildSessionFromSsoClaims(claims)
  const cookieValue = signStudioSession(session)
  setCookie(c, STUDIO_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return success(c, {
    session,
    redirect_to: normalizeLegacyPath(body.next, session.drama_id),
  })
})

app.post('/logout', async (c) => {
  deleteCookie(c, STUDIO_SESSION_COOKIE, { path: '/' })
  return success(c)
})

app.use('/session/*', requireStudioAuth)

app.get('/session/me', async (c) => {
  const context = getStudioContext(c)
  return success(c, context.session)
})

export default app
