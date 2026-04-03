import type { Context } from 'hono'
import { and, eq, inArray, isNull, or } from 'drizzle-orm'

import { db, executeWrite, queryAll, schema } from '../../db/index.js'
import { now } from '../../utils/response.js'
import { getStudioContext, type StudioRequestContext } from './auth.js'
import { getDramaById, getEpisodeById } from '../../db/repos/studio-content.js'

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

  await executeWrite(
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
      ),
  )
}

export async function listScopedDramaIds(c: Context) {
  const context = getStudioContext(c)
  const dramas = await queryAll(
    db
      .select({
        id: schema.dramas.id,
        appWorkspaceId: schema.dramas.appWorkspaceId,
        appUserId: schema.dramas.appUserId,
      })
      .from(schema.dramas)
      .where(and(isNull(schema.dramas.deletedAt), buildDramaScopeClause(context))),
  )

  const legacyIds = dramas
    .filter((drama) => !drama.appWorkspaceId && !drama.appUserId)
    .map((drama) => drama.id)

  await claimLegacyDramaOwnershipByIds(context, legacyIds)
  return dramas.map((drama) => drama.id)
}

export async function getScopedDrama(c: Context, dramaId: number) {
  const context = getStudioContext(c)
  const drama = await getDramaById(dramaId)

  if (!drama || !(
    drama.appWorkspaceId === context.session.workspace_id ||
    drama.appUserId === context.session.sub ||
    (!drama.appWorkspaceId && !drama.appUserId)
  )) {
    return null
  }

  if (!drama.appWorkspaceId && !drama.appUserId) {
    await claimLegacyDramaOwnershipByIds(context, [drama.id])
  }

  return drama
}

export async function getScopedEpisode(c: Context, episodeId: number) {
  const episode = await getEpisodeById(episodeId)
  if (!episode) {
    return null
  }

  const drama = await getScopedDrama(c, episode.dramaId)
  if (!drama) {
    return null
  }

  return episode
}
