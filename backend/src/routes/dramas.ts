import { Hono } from 'hono'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { success, badRequest, notFound, created, now } from '../utils/response.js'
import { toSnakeCase, toSnakeCaseArray } from '../utils/transform.js'
import {
  claimLegacyDramaOwnershipByIds,
  getScopedDrama,
  getTrendShortOwnership,
  listScopedDramaIds,
} from '../integrations/trendshort/scope.js'
import { getStudioContext } from '../integrations/trendshort/auth.js'

const app = new Hono()

// GET /dramas - List dramas
app.get('/', async (c) => {
  const page = Number(c.req.query('page') || 1)
  const pageSize = Number(c.req.query('page_size') || 20)
  const status = c.req.query('status')
  const keyword = c.req.query('keyword')
  const studioContext = getStudioContext(c)

  const allRows = await db.select()
    .from(schema.dramas)
    .where(
      and(
        isNull(schema.dramas.deletedAt),
        eq(schema.dramas.appWorkspaceId, studioContext.session.workspace_id),
      ),
    )
    .orderBy(desc(schema.dramas.updatedAt))
    .all()

  const legacyRows = await db.select()
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

  await claimLegacyDramaOwnershipByIds(studioContext, legacyRows.map((drama) => drama.id))

  const combinedRows = [...allRows, ...legacyRows].reduce<typeof allRows>((acc, drama) => {
    if (!acc.some((item) => item.id === drama.id)) {
      acc.push(drama)
    }
    return acc
  }, [])
  let filtered = combinedRows

  if (status) filtered = filtered.filter(d => d.status === status)
  if (keyword) filtered = filtered.filter(d => d.title.includes(keyword))

  const total = filtered.length
  const items = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Attach episode/character/scene counts
  const enriched = await Promise.all(items.map(async (drama) => {
    const eps = await db.select().from(schema.episodes)
      .where(eq(schema.episodes.dramaId, drama.id))
    const chars = await db.select().from(schema.characters)
      .where(eq(schema.characters.dramaId, drama.id))
    const scns = await db.select().from(schema.scenes)
      .where(eq(schema.scenes.dramaId, drama.id))
    return {
      ...toSnakeCase(drama),
      tags: drama.tags ? JSON.parse(drama.tags) : [],
      total_episodes: eps.length,
      episodes: toSnakeCaseArray(eps),
      characters: toSnakeCaseArray(chars),
      scenes: toSnakeCaseArray(scns),
    }
  }))

  return success(c, {
    items: enriched,
    pagination: { page, page_size: pageSize, total, total_pages: Math.ceil(total / pageSize) },
  })
})

// POST /dramas - Create drama
app.post('/', async (c) => {
  const body = await c.req.json()
  const ts = now()
  const studioContext = getStudioContext(c)
  const res = db.insert(schema.dramas).values({
    title: body.title,
    ...getTrendShortOwnership(studioContext),
    description: body.description,
    genre: body.genre,
    style: body.style,
    tags: body.tags ? JSON.stringify(body.tags) : null,
    metadata: body.metadata,
    status: 'draft',
    createdAt: ts,
    updatedAt: ts,
  }).run()

  const [result] = db.select().from(schema.dramas)
    .where(eq(schema.dramas.id, Number(res.lastInsertRowid))).all()

  // Create default episodes
  const totalEpisodes = body.total_episodes || 1
  for (let i = 1; i <= totalEpisodes; i++) {
    db.insert(schema.episodes).values({
      dramaId: result.id,
      episodeNumber: i,
      title: `第${i}集`,
      status: 'draft',
      createdAt: ts,
      updatedAt: ts,
    }).run()
  }

  return created(c, toSnakeCase(result))
})


// GET /dramas/stats — must be before /:id
app.get('/stats', async (c) => {
  const dramaIds = await listScopedDramaIds(c)
  const all = dramaIds.length
    ? db.select().from(schema.dramas).where(and(isNull(schema.dramas.deletedAt), eq(schema.dramas.appWorkspaceId, getStudioContext(c).session.workspace_id))).all()
    : []
  const byStatus = Object.entries(
    all.reduce((acc, d) => {
      acc[d.status || 'draft'] = (acc[d.status || 'draft'] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }))
  return success(c, { total: all.length, by_status: byStatus })
})

app.get('/:id/stats', async (c) => {
  const id = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, id)
  if (!drama) return notFound(c, '剧本不存在')

  const episodes = await db.select().from(schema.episodes).where(eq(schema.episodes.dramaId, id))
  const videos = await db.select().from(schema.videoGenerations).where(eq(schema.videoGenerations.dramaId, id))

  return success(c, {
    total_episodes: episodes.length,
    completed_episodes: episodes.filter((episode) => episode.status === 'completed' || !!episode.videoUrl).length,
    total_videos: videos.filter((video) => video.status === 'completed').length,
  })
})

// GET /dramas/:id - Get drama detail
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, id)
  if (!drama) return notFound(c, '剧本不存在')

  const eps = await db.select().from(schema.episodes)
    .where(eq(schema.episodes.dramaId, id))
  const chars = await db.select().from(schema.characters)
    .where(eq(schema.characters.dramaId, id))
  const scns = await db.select().from(schema.scenes)
    .where(eq(schema.scenes.dramaId, id))
  const prps = await db.select().from(schema.props)
    .where(eq(schema.props.dramaId, id))

  return success(c, {
    ...toSnakeCase(drama),
    tags: drama.tags ? JSON.parse(drama.tags) : [],
    episodes: toSnakeCaseArray(eps),
    characters: toSnakeCaseArray(chars),
    scenes: toSnakeCaseArray(scns),
    props: toSnakeCaseArray(prps),
  })
})

// PUT /dramas/:id - Update drama
app.put('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, id)
  if (!drama) return notFound(c, '剧本不存在')
  const body = await c.req.json()
  const updates: Record<string, any> = { updatedAt: now() }
  if (body.title !== undefined) updates.title = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.genre !== undefined) updates.genre = body.genre
  if (body.style !== undefined) updates.style = body.style
  if (body.status !== undefined) updates.status = body.status
  if (body.tags !== undefined) updates.tags = JSON.stringify(body.tags)
  if (body.metadata !== undefined) updates.metadata = body.metadata
  db.update(schema.dramas).set(updates).where(eq(schema.dramas.id, id)).run()
  return success(c)
})

// DELETE /dramas/:id - Soft delete
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, id)
  if (!drama) return notFound(c, '剧本不存在')
  await db.update(schema.dramas).set({ deletedAt: now() }).where(eq(schema.dramas.id, id))
  return success(c)
})

// PUT /dramas/:id/characters - Save characters
app.put('/:id/characters', async (c) => {
  const dramaId = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, dramaId)
  if (!drama) return notFound(c, '剧本不存在')
  const body = await c.req.json()
  const chars = body.characters || []
  const ts = now()

  for (const char of chars) {
    if (char.id) {
      await db.update(schema.characters).set({ ...char, updatedAt: ts }).where(eq(schema.characters.id, char.id))
    } else {
      await db.insert(schema.characters).values({ ...char, dramaId, createdAt: ts, updatedAt: ts })
    }
  }
  return success(c)
})

// PUT /dramas/:id/episodes - Save episodes
app.put('/:id/episodes', async (c) => {
  const dramaId = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, dramaId)
  if (!drama) return notFound(c, '剧本不存在')
  const body = await c.req.json()
  const episodes = body.episodes || []
  const ts = now()

  for (const ep of episodes) {
    if (ep.id) {
      await db.update(schema.episodes).set({ ...ep, updatedAt: ts }).where(eq(schema.episodes.id, ep.id))
    } else {
      await db.insert(schema.episodes).values({
        ...ep,
        dramaId,
        episodeNumber: ep.episode_number || ep.episodeNumber || 1,
        title: ep.title || '未命名',
        createdAt: ts,
        updatedAt: ts,
      })
    }
  }
  return success(c)
})

export default app
