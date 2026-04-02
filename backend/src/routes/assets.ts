import { Hono } from 'hono'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'

import { db, schema } from '../db/index.js'
import { success } from '../utils/response.js'
import { getScopedDrama, listScopedDramaIds } from '../integrations/trendshort/scope.js'

const app = new Hono()

app.get('/', async (c) => {
  const dramaId = Number(c.req.query('drama_id') || 0)
  const type = c.req.query('type')
  const page = Number(c.req.query('page') || 1)
  const pageSize = Number(c.req.query('page_size') || 20)

  const filters = [isNull(schema.assets.deletedAt)]
  if (dramaId) {
    const drama = await getScopedDrama(c, dramaId)
    if (!drama) {
      return success(c, {
        items: [],
        pagination: {
          page,
          page_size: pageSize,
          total: 0,
          total_pages: 0,
        },
      })
    }
    filters.push(eq(schema.assets.dramaId, dramaId))
  } else {
    const dramaIds = await listScopedDramaIds(c)
    if (!dramaIds.length) {
      return success(c, {
        items: [],
        pagination: {
          page,
          page_size: pageSize,
          total: 0,
          total_pages: 0,
        },
      })
    }
    filters.push(inArray(schema.assets.dramaId, dramaIds))
  }
  if (type) {
    filters.push(eq(schema.assets.type, type))
  }

  const rows = db.select().from(schema.assets).where(and(...filters)).orderBy(desc(schema.assets.createdAt)).all()
  const total = rows.length
  const items = rows.slice((page - 1) * pageSize, page * pageSize).map((item) => ({
    id: item.id,
    type: item.type,
    url: item.url,
    name: item.name,
    drama_id: item.dramaId,
    episode_id: item.episodeId,
    storyboard_id: item.storyboardId,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }))

  return success(c, {
    items,
    pagination: {
      page,
      page_size: pageSize,
      total,
      total_pages: Math.ceil(total / pageSize),
    },
  })
})

export default app
