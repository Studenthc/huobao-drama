import { Hono } from 'hono'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { success, badRequest, notFound, created, now } from '../utils/response.js'
import { toSnakeCase, toSnakeCaseArray } from '../utils/transform.js'
import {
  createDrama,
  createEpisode,
  getDramaById,
  listCharactersByDramaId,
  listEpisodesByDramaId,
  listLegacyDramas,
  listOwnedDramasByWorkspace,
  listPropsByDramaId,
  listScenesByDramaId,
  listWorkspaceDramas,
  saveDramaCharacters,
  saveDramaEpisodes,
  updateDrama,
} from '../db/repos/studio-content.js'
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

  const allRows = await listOwnedDramasByWorkspace(studioContext.session.workspace_id)
  const legacyRows = await listLegacyDramas()

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
    const [eps, chars, scns] = await Promise.all([
      listEpisodesByDramaId(drama.id),
      listCharactersByDramaId(drama.id),
      listScenesByDramaId(drama.id),
    ])
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
  const result = await createDrama({
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
  })
  if (!result) return badRequest(c, '创建剧本失败')

  // Create default episodes
  const totalEpisodes = body.total_episodes || 1
  for (let i = 1; i <= totalEpisodes; i++) {
    await createEpisode({
      dramaId: result.id,
      episodeNumber: i,
      title: `第${i}集`,
      status: 'draft',
      createdAt: ts,
      updatedAt: ts,
    })
  }

  return created(c, toSnakeCase(result))
})


// GET /dramas/stats — must be before /:id
app.get('/stats', async (c) => {
  const dramaIds = await listScopedDramaIds(c)
  const all = dramaIds.length
    ? await listWorkspaceDramas(getStudioContext(c).session.workspace_id)
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

  const episodes = await listEpisodesByDramaId(id)
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

  const [eps, chars, scns, prps] = await Promise.all([
    listEpisodesByDramaId(id),
    listCharactersByDramaId(id),
    listScenesByDramaId(id),
    listPropsByDramaId(id),
  ])

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
  await updateDrama(id, updates)
  return success(c)
})

// DELETE /dramas/:id - Soft delete
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const drama = await getScopedDrama(c, id)
  if (!drama) return notFound(c, '剧本不存在')
  await updateDrama(id, { deletedAt: now() })
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

  await saveDramaCharacters(dramaId, chars, ts)
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

  await saveDramaEpisodes(dramaId, episodes, ts)
  return success(c)
})

export default app
