import type { StudioRequestContext } from './auth.js'

const PATHS = {
  authorize: '/api/studio/authorize',
  finalize: '/api/studio/finalize',
  refund: '/api/studio/refund',
}

function getTrendShortAppUrl() {
  return process.env.TREND_SHORT_APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim() || ''
}

function getStudioServiceSecret() {
  return process.env.STUDIO_SERVICE_SECRET?.trim() || ''
}

function canUseTrendShortBilling(context: StudioRequestContext) {
  return Boolean(getTrendShortAppUrl() && getStudioServiceSecret() && context.session.project_id && context.session.sub)
}

async function postToTrendShort(path: string, body: Record<string, unknown>) {
  const baseUrl = getTrendShortAppUrl()
  const secret = getStudioServiceSecret()
  if (!baseUrl || !secret) {
    throw new Error('TrendShort billing integration is not configured')
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-studio-service-secret': secret,
    },
    body: JSON.stringify(body),
  })

  const json = await response.json().catch(() => ({})) as {
    data?: Record<string, unknown>
    message?: string
    error?: { message?: string }
  }

  if (!response.ok) {
    const error = new Error(json.error?.message || json.message || `TrendShort billing error ${response.status}`) as Error & {
      status?: number
    }
    error.status = response.status
    throw error
  }

  return json.data ?? null
}

export async function authorizeStudioAction(context: StudioRequestContext, action: string, payload: Record<string, unknown> = {}) {
  if (!canUseTrendShortBilling(context)) {
    return null
  }

  const data = await postToTrendShort(PATHS.authorize, {
    projectId: context.session.project_id,
    userId: context.session.sub,
    action,
    payload,
  })

  return {
    authorizationId: String(data?.authorization_id || ''),
    creditsToHold: Number(data?.credits_to_hold || 0),
  }
}

export async function finalizeStudioAction(
  context: StudioRequestContext,
  authorizationId: string | null | undefined,
  result: Record<string, unknown> = {},
) {
  if (!authorizationId || !canUseTrendShortBilling(context)) {
    return
  }

  await postToTrendShort(PATHS.finalize, {
    authorizationId,
    userId: context.session.sub,
    result,
  })
}

export async function refundStudioAction(
  context: StudioRequestContext,
  authorizationId: string | null | undefined,
  reason: string,
  result: Record<string, unknown> = {},
) {
  if (!authorizationId || !canUseTrendShortBilling(context)) {
    return
  }

  await postToTrendShort(PATHS.refund, {
    authorizationId,
    userId: context.session.sub,
    reason,
    result,
  })
}
