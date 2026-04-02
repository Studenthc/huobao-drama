// TrendShort-specific Studio integration surface.
// Keep upstream workflow code outside this namespace whenever possible.
export { default as trendshortRouter } from './router.js'
export {
  getStudioContext,
  requireStudioAuth,
  type StudioRequestContext,
} from './auth.js'
export {
  STUDIO_SESSION_COOKIE,
  buildSessionFromSsoClaims,
  signStudioSession,
  verifyStudioSession,
  type StudioSessionClaims,
} from './session.js'
export {
  authorizeStudioAction,
  finalizeStudioAction,
  refundStudioAction,
} from './billing.js'
