import { Hono } from 'hono'
import { eq, inArray } from 'drizzle-orm'

import { db, schema } from '../db/index.js'
import { success } from '../utils/response.js'
import { getScopedDrama, getScopedEpisode } from '../integrations/trendshort/scope.js'

const app = new Hono()

function statusToProgress(status: string | null | undefined) {
  if (status === 'completed' || status === 'failed') return 100
  if (status === 'processing') return 60
  return 0
}

app.get('/', async (c) => {
  const resourceId = Number(c.req.query('resource_id') || 0)
  if (!resourceId) {
    return success(c, [])
  }

  const drama = await getScopedDrama(c, resourceId)
  const episode = drama ? null : await getScopedEpisode(c, resourceId)

  const tasks: Array<{
    id: string
    type: string
    status: string
    progress: number
    resource_id: string
    created_at?: string
  }> = []

  if (drama) {
    const images = db.select().from(schema.imageGenerations).where(eq(schema.imageGenerations.dramaId, drama.id)).all()
    const videos = db.select().from(schema.videoGenerations).where(eq(schema.videoGenerations.dramaId, drama.id)).all()
    const merges = db.select().from(schema.videoMerges).where(eq(schema.videoMerges.dramaId, drama.id)).all()

    tasks.push(
      ...images.map((item) => ({
        id: `image-${item.id}`,
        type: 'image_generation',
        status: item.status || 'pending',
        progress: statusToProgress(item.status),
        resource_id: String(drama.id),
        created_at: item.createdAt,
      })),
      ...videos.map((item) => ({
        id: `video-${item.id}`,
        type: 'video_generation',
        status: item.status || 'pending',
        progress: statusToProgress(item.status),
        resource_id: String(drama.id),
        created_at: item.createdAt,
      })),
      ...merges.map((item) => ({
        id: `merge-${item.id}`,
        type: 'merge_generation',
        status: item.status || 'pending',
        progress: statusToProgress(item.status),
        resource_id: String(drama.id),
        created_at: item.createdAt,
      })),
    )
  }

  if (episode) {
    const storyboards = db.select().from(schema.storyboards).where(eq(schema.storyboards.episodeId, episode.id)).all()
    const storyboardIds = storyboards.map((item) => item.id)
    const images = storyboardIds.length
      ? db.select().from(schema.imageGenerations).where(inArray(schema.imageGenerations.storyboardId, storyboardIds)).all()
      : []
    const videos = storyboardIds.length
      ? db.select().from(schema.videoGenerations).where(inArray(schema.videoGenerations.storyboardId, storyboardIds)).all()
      : []
    const merges = db.select().from(schema.videoMerges).where(eq(schema.videoMerges.episodeId, episode.id)).all()

    tasks.push(
      ...images.map((item) => ({
        id: `image-${item.id}`,
        type: 'image_generation',
        status: item.status || 'pending',
        progress: statusToProgress(item.status),
        resource_id: String(episode.id),
        created_at: item.createdAt,
      })),
      ...videos.map((item) => ({
        id: `video-${item.id}`,
        type: 'video_generation',
        status: item.status || 'pending',
        progress: statusToProgress(item.status),
        resource_id: String(episode.id),
        created_at: item.createdAt,
      })),
      ...merges.map((item) => ({
        id: `merge-${item.id}`,
        type: 'merge_generation',
        status: item.status || 'pending',
        progress: statusToProgress(item.status),
        resource_id: String(episode.id),
        created_at: item.createdAt,
      })),
    )
  }

  return success(c, tasks.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')))
})

export default app
