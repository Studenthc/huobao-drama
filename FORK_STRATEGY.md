# TrendShort Studio Fork Strategy

`trendshort-studio` is maintained as a thin integration fork of [`chatfire-AI/huobao-drama`](https://github.com/chatfire-AI/huobao-drama).

The default operating model is:

- `huobao-drama` remains the upstream Studio core.
- `trendshort-studio` remains the only local Studio mainline.
- TrendShort-specific code stays inside explicit integration namespaces.
- SaaS-facing product logic belongs in `storyshort-replica`, not in Studio.

## Branch Model

- `upstream/master`
  - mirror of the current upstream `huobao-drama` default branch
- `main`
  - TrendShort releasable integration branch
- `integration/*`
  - short-lived branches for SSO, billing, locale, or adapter work

Recommended sync flow:

1. fetch and review `upstream/master`
2. merge or rebase `main` onto the latest upstream snapshot
3. resolve only integration-layer conflicts
4. keep workflow/schema changes out unless explicitly approved

Do not create new long-lived Studio copies such as `studio-next`, `studio-v2`, or ad-hoc directory clones.

## Allowed Studio Changes

These changes are expected and supported in this fork:

- TrendShort SSO handoff and session exchange
- return flow back to TrendShort
- credits billing callbacks: authorize / finalize / refund
- locale handoff and Studio shell language switching
- TrendShort branding shell and minimal navigation affordances
- adapters that reshape Studio data into stable control-plane contracts

## Disallowed By Default

These changes require explicit review before landing:

- reordering the core Studio workflow
- rewriting upstream page structure or major component trees
- changing core schema or persistence shape for TrendShort-only reasons
- reworking agent architecture beyond the minimum integration surface
- putting SaaS concepts directly into Studio

If a feature can reasonably live in `storyshort-replica`, it should not be added to Studio.

## Integration Boundaries

TrendShort-specific code must stay under one of these namespaces:

- `backend/src/integrations/trendshort/*`
- `frontend/app/integrations/trendshort/*`

Thin compatibility re-exports are acceptable in old file locations to reduce churn while keeping the real implementation centralized.

Current stable responsibilities:

- `backend/src/integrations/trendshort/session.ts`
  - Studio session cookie and claim helpers
- `backend/src/integrations/trendshort/auth.ts`
  - Studio auth middleware and request context
- `backend/src/integrations/trendshort/billing.ts`
  - TrendShort credits authorize / finalize / refund client
- `backend/src/integrations/trendshort/router.ts`
  - `/api/studio/*` SSO and session routes
- `frontend/app/integrations/trendshort/locale.ts`
  - locale source, cookie, handoff inheritance
- `frontend/app/integrations/trendshort/session.ts`
  - current Studio session fetcher
- `frontend/app/integrations/trendshort/branding.ts`
  - shell-level TrendShort branding

## Stable Contract With Storyshort

`storyshort-replica` should consume Studio through stable adapters instead of internal route assumptions.

Stable contract surface:

- SSO exchange/session endpoints
- credits callbacks
- Studio overview aggregation
- Studio deep-link helpers owned by `storyshort-replica`

`storyshort-replica` pages should not construct raw Studio internals directly when a shared adapter or helper can own that logic.

## Review Rule

Every Studio change should answer at least one of these:

- Is this necessary for SSO or auth?
- Is this necessary for billing or return flow?
- Is this necessary for locale or brand shell continuity?
- Is this necessary to adapt upstream Studio data into a stable TrendShort contract?

If the answer is no, the change probably belongs somewhere else.
