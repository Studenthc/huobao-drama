import { and, desc, eq, inArray, isNull } from 'drizzle-orm'

import { db, executeWrite, insertAndReturnOne, queryAll, queryFirst, schema } from '../index.js'

export async function listOwnedDramasByWorkspace(workspaceId: string) {
  return queryAll(
    db.select()
      .from(schema.dramas)
      .where(
        and(
          isNull(schema.dramas.deletedAt),
          eq(schema.dramas.appWorkspaceId, workspaceId),
        ),
      )
      .orderBy(desc(schema.dramas.updatedAt)),
  )
}

export async function listLegacyDramas() {
  return queryAll(
    db.select()
      .from(schema.dramas)
      .where(
        and(
          isNull(schema.dramas.deletedAt),
          isNull(schema.dramas.appWorkspaceId),
          isNull(schema.dramas.appUserId),
        ),
      )
      .orderBy(desc(schema.dramas.updatedAt)),
  )
}

export async function listWorkspaceDramas(workspaceId: string) {
  return queryAll(
    db.select()
      .from(schema.dramas)
      .where(
        and(
          isNull(schema.dramas.deletedAt),
          eq(schema.dramas.appWorkspaceId, workspaceId),
        ),
      ),
  )
}

export async function getDramaById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.dramas)
      .where(eq(schema.dramas.id, id)),
  )
}

export async function createDrama(values: typeof schema.dramas.$inferInsert) {
  return insertAndReturnOne(schema.dramas, values, schema.dramas.id)
}

export async function updateDrama(id: number, updates: Partial<typeof schema.dramas.$inferInsert>) {
  await executeWrite(
    db.update(schema.dramas).set(updates).where(eq(schema.dramas.id, id)),
  )
}

export async function listEpisodesByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.episodes)
      .where(eq(schema.episodes.dramaId, dramaId)),
  )
}

export async function listEpisodesByDramaIdOrdered(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.episodes)
      .where(eq(schema.episodes.dramaId, dramaId))
      .orderBy(schema.episodes.episodeNumber),
  )
}

export async function createEpisode(values: typeof schema.episodes.$inferInsert) {
  return insertAndReturnOne(schema.episodes, values, schema.episodes.id)
}

export async function getEpisodeById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.episodes)
      .where(eq(schema.episodes.id, id)),
  )
}

export async function updateEpisode(id: number, updates: Partial<typeof schema.episodes.$inferInsert>) {
  await executeWrite(
    db.update(schema.episodes).set(updates).where(eq(schema.episodes.id, id)),
  )
}

export async function listCharactersByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.characters)
      .where(eq(schema.characters.dramaId, dramaId)),
  )
}

export async function listCharactersByIds(characterIds: number[]) {
  if (!characterIds.length) return []
  return queryAll(
    db.select()
      .from(schema.characters)
      .where(inArray(schema.characters.id, characterIds)),
  )
}

export async function getCharacterById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.characters)
      .where(eq(schema.characters.id, id)),
  )
}

export async function listScenesByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.scenes)
      .where(eq(schema.scenes.dramaId, dramaId)),
  )
}

export async function getSceneById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.scenes)
      .where(eq(schema.scenes.id, id)),
  )
}

export async function createScene(values: typeof schema.scenes.$inferInsert) {
  return insertAndReturnOne(schema.scenes, values, schema.scenes.id)
}

export async function deleteScene(id: number) {
  await executeWrite(
    db.delete(schema.scenes).where(eq(schema.scenes.id, id)),
  )
}

export async function listPropsByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.props)
      .where(eq(schema.props.dramaId, dramaId)),
  )
}

export async function listEpisodeCharacterLinks(episodeId: number) {
  return queryAll(
    db.select()
      .from(schema.episodeCharacters)
      .where(eq(schema.episodeCharacters.episodeId, episodeId)),
  )
}

export async function listEpisodeSceneLinks(episodeId: number) {
  return queryAll(
    db.select()
      .from(schema.episodeScenes)
      .where(eq(schema.episodeScenes.episodeId, episodeId)),
  )
}

export async function listStoryboardsByEpisodeIdOrdered(episodeId: number) {
  return queryAll(
    db.select()
      .from(schema.storyboards)
      .where(eq(schema.storyboards.episodeId, episodeId))
      .orderBy(schema.storyboards.storyboardNumber),
  )
}

export async function createStoryboard(values: typeof schema.storyboards.$inferInsert) {
  return insertAndReturnOne(schema.storyboards, values, schema.storyboards.id)
}

export async function deleteStoryboard(id: number) {
  await executeWrite(
    db.delete(schema.storyboards).where(eq(schema.storyboards.id, id)),
  )
}

export async function listStoryboardCharacterLinks() {
  return queryAll(db.select().from(schema.storyboardCharacters))
}

export async function listStoryboardCharacterLinksByStoryboardId(storyboardId: number) {
  return queryAll(
    db.select()
      .from(schema.storyboardCharacters)
      .where(eq(schema.storyboardCharacters.storyboardId, storyboardId)),
  )
}

export async function replaceStoryboardCharacters(storyboardId: number, characterIds: number[]) {
  await executeWrite(
    db.delete(schema.storyboardCharacters)
      .where(eq(schema.storyboardCharacters.storyboardId, storyboardId)),
  )

  const uniqueIds = [...new Set((characterIds || []).filter(Boolean))]
  for (const characterId of uniqueIds) {
    await executeWrite(
      db.insert(schema.storyboardCharacters).values({
        storyboardId,
        characterId,
      }),
    )
  }
}

export async function listVideoMergesByEpisodeId(episodeId: number) {
  return queryAll(
    db.select()
      .from(schema.videoMerges)
      .where(eq(schema.videoMerges.episodeId, episodeId)),
  )
}

export async function listImageGenerationsByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.imageGenerations)
      .where(eq(schema.imageGenerations.dramaId, dramaId)),
  )
}

export async function listVideoGenerationsByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.videoGenerations)
      .where(eq(schema.videoGenerations.dramaId, dramaId)),
  )
}

export async function listVideoMergesByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.videoMerges)
      .where(eq(schema.videoMerges.dramaId, dramaId)),
  )
}

export async function listImageGenerationsByStoryboardIds(storyboardIds: number[]) {
  if (!storyboardIds.length) return []
  return queryAll(
    db.select()
      .from(schema.imageGenerations)
      .where(inArray(schema.imageGenerations.storyboardId, storyboardIds)),
  )
}

export async function listVideoGenerationsByStoryboardIds(storyboardIds: number[]) {
  if (!storyboardIds.length) return []
  return queryAll(
    db.select()
      .from(schema.videoGenerations)
      .where(inArray(schema.videoGenerations.storyboardId, storyboardIds)),
  )
}

export async function listAssetsByDramaIds(dramaIds: number[]) {
  if (!dramaIds.length) return []
  return queryAll(
    db.select()
      .from(schema.assets)
      .where(and(isNull(schema.assets.deletedAt), inArray(schema.assets.dramaId, dramaIds)))
      .orderBy(desc(schema.assets.createdAt)),
  )
}

export async function listAssetsByDramaId(dramaId: number) {
  return queryAll(
    db.select()
      .from(schema.assets)
      .where(and(isNull(schema.assets.deletedAt), eq(schema.assets.dramaId, dramaId)))
      .orderBy(desc(schema.assets.createdAt)),
  )
}

export async function listAssetsByDramaIdsAndType(dramaIds: number[], type: string) {
  if (!dramaIds.length) return []
  return queryAll(
    db.select()
      .from(schema.assets)
      .where(
        and(
          isNull(schema.assets.deletedAt),
          inArray(schema.assets.dramaId, dramaIds),
          eq(schema.assets.type, type),
        ),
      )
      .orderBy(desc(schema.assets.createdAt)),
  )
}

export async function listAssetsByDramaIdAndType(dramaId: number, type: string) {
  return queryAll(
    db.select()
      .from(schema.assets)
      .where(
        and(
          isNull(schema.assets.deletedAt),
          eq(schema.assets.dramaId, dramaId),
          eq(schema.assets.type, type),
        ),
      )
      .orderBy(desc(schema.assets.createdAt)),
  )
}

export async function getStoryboardById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.storyboards)
      .where(eq(schema.storyboards.id, id)),
  )
}

export async function updateStoryboard(id: number, updates: Partial<typeof schema.storyboards.$inferInsert>) {
  await executeWrite(
    db.update(schema.storyboards).set(updates).where(eq(schema.storyboards.id, id)),
  )
}

export async function updateStoryboardsByEpisodeId(
  episodeId: number,
  updates: Partial<typeof schema.storyboards.$inferInsert>,
) {
  await executeWrite(
    db.update(schema.storyboards).set(updates).where(eq(schema.storyboards.episodeId, episodeId)),
  )
}

export async function updateCharacter(id: number, updates: Partial<typeof schema.characters.$inferInsert>) {
  await executeWrite(
    db.update(schema.characters).set(updates).where(eq(schema.characters.id, id)),
  )
}

export async function updateScene(id: number, updates: Partial<typeof schema.scenes.$inferInsert>) {
  await executeWrite(
    db.update(schema.scenes).set(updates).where(eq(schema.scenes.id, id)),
  )
}

export async function createImageGeneration(values: typeof schema.imageGenerations.$inferInsert) {
  return insertAndReturnOne(schema.imageGenerations, values, schema.imageGenerations.id)
}

export async function getImageGenerationById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.imageGenerations)
      .where(eq(schema.imageGenerations.id, id)),
  )
}

export async function updateImageGeneration(id: number, updates: Partial<typeof schema.imageGenerations.$inferInsert>) {
  await executeWrite(
    db.update(schema.imageGenerations).set(updates).where(eq(schema.imageGenerations.id, id)),
  )
}

export async function listImageGenerations(filters?: { storyboardId?: number; dramaId?: number }) {
  let rows = await queryAll(db.select().from(schema.imageGenerations))
  if (filters?.storyboardId != null) rows = rows.filter((row) => row.storyboardId === filters.storyboardId)
  if (filters?.dramaId != null) rows = rows.filter((row) => row.dramaId === filters.dramaId)
  return rows
}

export async function deleteImageGeneration(id: number) {
  await executeWrite(
    db.delete(schema.imageGenerations).where(eq(schema.imageGenerations.id, id)),
  )
}

export async function createVideoGeneration(values: typeof schema.videoGenerations.$inferInsert) {
  return insertAndReturnOne(schema.videoGenerations, values, schema.videoGenerations.id)
}

export async function getVideoGenerationById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.videoGenerations)
      .where(eq(schema.videoGenerations.id, id)),
  )
}

export async function getVideoGenerationByTaskId(taskId: string) {
  return queryFirst(
    db.select()
      .from(schema.videoGenerations)
      .where(eq(schema.videoGenerations.taskId, taskId)),
  )
}

export async function updateVideoGeneration(id: number, updates: Partial<typeof schema.videoGenerations.$inferInsert>) {
  await executeWrite(
    db.update(schema.videoGenerations).set(updates).where(eq(schema.videoGenerations.id, id)),
  )
}

export async function listVideoGenerations(filters?: { storyboardId?: number; dramaId?: number }) {
  let rows = await queryAll(db.select().from(schema.videoGenerations))
  if (filters?.storyboardId != null) rows = rows.filter((row) => row.storyboardId === filters.storyboardId)
  if (filters?.dramaId != null) rows = rows.filter((row) => row.dramaId === filters.dramaId)
  return rows
}

export async function deleteVideoGeneration(id: number) {
  await executeWrite(
    db.delete(schema.videoGenerations).where(eq(schema.videoGenerations.id, id)),
  )
}

export async function createVideoMerge(values: typeof schema.videoMerges.$inferInsert) {
  return insertAndReturnOne(schema.videoMerges, values, schema.videoMerges.id)
}

export async function getVideoMergeById(id: number) {
  return queryFirst(
    db.select()
      .from(schema.videoMerges)
      .where(eq(schema.videoMerges.id, id)),
  )
}

export async function updateVideoMerge(id: number, updates: Partial<typeof schema.videoMerges.$inferInsert>) {
  await executeWrite(
    db.update(schema.videoMerges).set(updates).where(eq(schema.videoMerges.id, id)),
  )
}

export async function saveDramaCharacters(
  dramaId: number,
  characters: Array<Record<string, unknown>>,
  updatedAt: string,
) {
  for (const char of characters) {
    if (char.id) {
      await executeWrite(
        db.update(schema.characters)
          .set({ ...char, updatedAt } as any)
          .where(eq(schema.characters.id, Number(char.id))),
      )
    } else {
      await executeWrite(
        db.insert(schema.characters)
          .values({ ...char, dramaId, createdAt: updatedAt, updatedAt } as any),
      )
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
      await executeWrite(
        db.update(schema.episodes)
          .set({ ...ep, updatedAt } as any)
          .where(eq(schema.episodes.id, Number(ep.id))),
      )
    } else {
      await executeWrite(
        db.insert(schema.episodes).values({
          ...ep,
          dramaId,
          episodeNumber: Number(ep.episode_number ?? ep.episodeNumber ?? 1),
          title: String(ep.title || '未命名'),
          createdAt: updatedAt,
          updatedAt,
        } as any),
      )
    }
  }
}
