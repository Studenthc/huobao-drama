import { and, desc, eq, inArray, isNull } from 'drizzle-orm'

import { db, schema } from '../index.js'

export async function listOwnedDramasByWorkspace(workspaceId: string) {
  return db.select()
    .from(schema.dramas)
    .where(
      and(
        isNull(schema.dramas.deletedAt),
        eq(schema.dramas.appWorkspaceId, workspaceId),
      ),
    )
    .orderBy(desc(schema.dramas.updatedAt))
    .all()
}

export async function listLegacyDramas() {
  return db.select()
    .from(schema.dramas)
    .where(
      and(
        isNull(schema.dramas.deletedAt),
        isNull(schema.dramas.appWorkspaceId),
        isNull(schema.dramas.appUserId),
      ),
    )
    .orderBy(desc(schema.dramas.updatedAt))
    .all()
}

export async function listWorkspaceDramas(workspaceId: string) {
  return db.select()
    .from(schema.dramas)
    .where(
      and(
        isNull(schema.dramas.deletedAt),
        eq(schema.dramas.appWorkspaceId, workspaceId),
      ),
    )
    .all()
}

export async function getDramaById(id: number) {
  const [row] = db.select()
    .from(schema.dramas)
    .where(eq(schema.dramas.id, id))
    .all()
  return row ?? null
}

export async function createDrama(values: typeof schema.dramas.$inferInsert) {
  const res = db.insert(schema.dramas).values(values).run()
  const [row] = db.select()
    .from(schema.dramas)
    .where(eq(schema.dramas.id, Number(res.lastInsertRowid)))
    .all()
  return row ?? null
}

export async function updateDrama(id: number, updates: Partial<typeof schema.dramas.$inferInsert>) {
  db.update(schema.dramas).set(updates).where(eq(schema.dramas.id, id)).run()
}

export async function listEpisodesByDramaId(dramaId: number) {
  return db.select()
    .from(schema.episodes)
    .where(eq(schema.episodes.dramaId, dramaId))
    .all()
}

export async function listEpisodesByDramaIdOrdered(dramaId: number) {
  return db.select()
    .from(schema.episodes)
    .where(eq(schema.episodes.dramaId, dramaId))
    .orderBy(schema.episodes.episodeNumber)
    .all()
}

export async function createEpisode(values: typeof schema.episodes.$inferInsert) {
  const res = db.insert(schema.episodes).values(values).run()
  const [row] = db.select()
    .from(schema.episodes)
    .where(eq(schema.episodes.id, Number(res.lastInsertRowid)))
    .all()
  return row ?? null
}

export async function getEpisodeById(id: number) {
  const [row] = db.select()
    .from(schema.episodes)
    .where(eq(schema.episodes.id, id))
    .all()
  return row ?? null
}

export async function updateEpisode(id: number, updates: Partial<typeof schema.episodes.$inferInsert>) {
  await db.update(schema.episodes).set(updates).where(eq(schema.episodes.id, id))
}

export async function listCharactersByDramaId(dramaId: number) {
  return db.select()
    .from(schema.characters)
    .where(eq(schema.characters.dramaId, dramaId))
    .all()
}

export async function listScenesByDramaId(dramaId: number) {
  return db.select()
    .from(schema.scenes)
    .where(eq(schema.scenes.dramaId, dramaId))
    .all()
}

export async function listPropsByDramaId(dramaId: number) {
  return db.select()
    .from(schema.props)
    .where(eq(schema.props.dramaId, dramaId))
    .all()
}

export async function listEpisodeCharacterLinks(episodeId: number) {
  return db.select()
    .from(schema.episodeCharacters)
    .where(eq(schema.episodeCharacters.episodeId, episodeId))
    .all()
}

export async function listEpisodeSceneLinks(episodeId: number) {
  return db.select()
    .from(schema.episodeScenes)
    .where(eq(schema.episodeScenes.episodeId, episodeId))
    .all()
}

export async function listStoryboardsByEpisodeIdOrdered(episodeId: number) {
  return db.select()
    .from(schema.storyboards)
    .where(eq(schema.storyboards.episodeId, episodeId))
    .orderBy(schema.storyboards.storyboardNumber)
    .all()
}

export async function listStoryboardCharacterLinks() {
  return db.select().from(schema.storyboardCharacters).all()
}

export async function listVideoMergesByEpisodeId(episodeId: number) {
  return db.select()
    .from(schema.videoMerges)
    .where(eq(schema.videoMerges.episodeId, episodeId))
    .all()
}

export async function listImageGenerationsByDramaId(dramaId: number) {
  return db.select()
    .from(schema.imageGenerations)
    .where(eq(schema.imageGenerations.dramaId, dramaId))
    .all()
}

export async function listVideoGenerationsByDramaId(dramaId: number) {
  return db.select()
    .from(schema.videoGenerations)
    .where(eq(schema.videoGenerations.dramaId, dramaId))
    .all()
}

export async function listVideoMergesByDramaId(dramaId: number) {
  return db.select()
    .from(schema.videoMerges)
    .where(eq(schema.videoMerges.dramaId, dramaId))
    .all()
}

export async function listImageGenerationsByStoryboardIds(storyboardIds: number[]) {
  if (!storyboardIds.length) return []
  return db.select()
    .from(schema.imageGenerations)
    .where(inArray(schema.imageGenerations.storyboardId, storyboardIds))
    .all()
}

export async function listVideoGenerationsByStoryboardIds(storyboardIds: number[]) {
  if (!storyboardIds.length) return []
  return db.select()
    .from(schema.videoGenerations)
    .where(inArray(schema.videoGenerations.storyboardId, storyboardIds))
    .all()
}

export async function listAssetsByDramaIds(dramaIds: number[]) {
  if (!dramaIds.length) return []
  return db.select()
    .from(schema.assets)
    .where(and(isNull(schema.assets.deletedAt), inArray(schema.assets.dramaId, dramaIds)))
    .orderBy(desc(schema.assets.createdAt))
    .all()
}

export async function listAssetsByDramaId(dramaId: number) {
  return db.select()
    .from(schema.assets)
    .where(and(isNull(schema.assets.deletedAt), eq(schema.assets.dramaId, dramaId)))
    .orderBy(desc(schema.assets.createdAt))
    .all()
}

export async function listAssetsByDramaIdsAndType(dramaIds: number[], type: string) {
  if (!dramaIds.length) return []
  return db.select()
    .from(schema.assets)
    .where(
      and(
        isNull(schema.assets.deletedAt),
        inArray(schema.assets.dramaId, dramaIds),
        eq(schema.assets.type, type),
      ),
    )
    .orderBy(desc(schema.assets.createdAt))
    .all()
}

export async function listAssetsByDramaIdAndType(dramaId: number, type: string) {
  return db.select()
    .from(schema.assets)
    .where(
      and(
        isNull(schema.assets.deletedAt),
        eq(schema.assets.dramaId, dramaId),
        eq(schema.assets.type, type),
      ),
    )
    .orderBy(desc(schema.assets.createdAt))
    .all()
}

export async function saveDramaCharacters(
  dramaId: number,
  characters: Array<Record<string, unknown>>,
  updatedAt: string,
) {
  for (const char of characters) {
    if (char.id) {
      await db.update(schema.characters)
        .set({ ...char, updatedAt } as any)
        .where(eq(schema.characters.id, Number(char.id)))
    } else {
      await db.insert(schema.characters)
        .values({ ...char, dramaId, createdAt: updatedAt, updatedAt } as any)
    }
  }
}

export async function saveDramaEpisodes(
  dramaId: number,
  episodes: Array<Record<string, unknown>>,
  updatedAt: string,
) {
  for (const ep of episodes) {
    if (ep.id) {
      await db.update(schema.episodes)
        .set({ ...ep, updatedAt } as any)
        .where(eq(schema.episodes.id, Number(ep.id)))
    } else {
      await db.insert(schema.episodes).values({
        ...ep,
        dramaId,
        episodeNumber: Number(ep.episode_number ?? ep.episodeNumber ?? 1),
        title: String(ep.title || '未命名'),
        createdAt: updatedAt,
        updatedAt,
      } as any)
    }
  }
}
