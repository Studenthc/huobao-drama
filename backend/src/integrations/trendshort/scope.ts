import type { Context } from 'hono'
import { and, eq, inArray, isNull, or } from 'drizzle-orm'

import { db, schema } from '../../db/index.js'
import { now } from '../../utils/response.js'
import { getStudioContext, type StudioRequestContext } from './auth.js'

function buildDramaScopeClause(context: StudioRequestContext) {
  return or(
    eq(schema.dramas.appWorkspaceId, context.session.workspace_id),
    eq(schema.dramas.appUserId, context.session.sub),
    and(isNull(schema.dramas.appWorkspaceId), isNull(schema.dramas.appUserId)),
  )!
}

export function getTrendShortOwnership(context: StudioRequestContext) {
  return {
    appWorkspaceId: context.session.workspace_id,
    appUserId: context.session.sub,
  }
}

export async function claimLegacyDramaOwnershipByIds(
  context: StudioRequestContext,
  dramaIds: number[],
) {
  if (!dramaIds.length) {
    return
  }

  db.update(schema.dramas)
    .set({
      ...getTrendShortOwnership(context),
      updatedAt: now(),
    })
    .where(
      and(
        inArray(schema.dramas.id, dramaIds),
        isNull(schema.dramas.appWorkspaceId),
        isNull(schema.dramas.appUserId),
      ),
    )
    .run()
}

export async function listScopedDramaIds(c: Context) {
  const context = getStudioContext(c)
  const dramas = db
    .select({
      id: schema.dramas.id,
      appWorkspaceId: schema.dramas.appWorkspaceId,
      appUserId: schema.dramas.appUserId,
    })
    .from(schema.dramas)
    .where(and(isNull(schema.dramas.deletedAt), buildDramaScopeClause(context)))
    .all()

  const legacyIds = dramas
    .filter((drama) => !drama.appWorkspaceId && !drama.appUserId)
    .map((drama) => drama.id)

  await claimLegacyDramaOwnershipByIds(context, legacyIds)
  return dramas.map((drama) => drama.id)
}

export async function getScopedDrama(c: Context, dramaId: number) {
  const context = getStudioContext(c)
  const [drama] = db
    .select()
    .from(schema.dramas)
    .where(and(eq(schema.dramas.id, dramaId), buildDramaScopeClause(context)))
    .all()

  if (!drama) {
    return null
  }

  if (!drama.appWorkspaceId && !drama.appUserId) {
    await claimLegacyDramaOwnershipByIds(context, [drama.id])
  }

  return drama
}

export async function getScopedEpisode(c: Context, episodeId: number) {
  const [episode] = db.select().from(schema.episodes).where(eq(schema.episodes.id, episodeId)).all()
  if (!episode) {
    return null
  }

  const drama = await getScopedDrama(c, episode.dramaId)
  if (!drama) {
    return null
  }

  return episode
}
