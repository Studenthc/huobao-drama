import { Hono } from 'hono'
import { success, created, now, badRequest } from '../utils/response.js'
import { generateImage } from '../services/image-generation.js'
import { logTaskError, logTaskPayload, logTaskStart, logTaskSuccess } from '../utils/task-logger.js'
import { authorizeStudioAction, getStudioContext } from '../integrations/trendshort/index.js'
import {
  deleteImageGeneration,
  getEpisodeById,
  getImageGenerationById,
  getStoryboardById,
  listImageGenerations,
} from '../db/repos/studio-content.js'

const app = new Hono()

// POST /images — Generate image
app.post('/', async (c) => {
  const body = await c.req.json()
  if (!body.prompt) return badRequest(c, 'prompt is required')

  try {
    const studioContext = getStudioContext(c)
    let configId: number | undefined = body.config_id
    if (body.storyboard_id) {
      const sb = await getStoryboardById(Number(body.storyboard_id))
      if (sb) {
        const ep = await getEpisodeById(sb.episodeId)
        if (ep?.imageConfigId != null) configId = ep.imageConfigId
      }
    }

    logTaskStart('ImageAPI', 'generate', {
      storyboardId: body.storyboard_id,
      sceneId: body.scene_id,
      characterId: body.character_id,
      dramaId: body.drama_id,
      frameType: body.frame_type,
    })
    logTaskPayload('ImageAPI', 'request body', body)
    const authorization = await authorizeStudioAction(studioContext, 'image_generation', {
      drama_id: body.drama_id,
      storyboard_id: body.storyboard_id,
      scene_id: body.scene_id,
      character_id: body.character_id,
    })
    const id = await generateImage({
      storyboardId: body.storyboard_id,
      dramaId: body.drama_id,
      sceneId: body.scene_id,
      characterId: body.character_id,
      prompt: body.prompt,
      model: body.model,
      size: body.size,
      referenceImages: body.reference_images,
      frameType: body.frame_type,
      configId,
      appProjectId: studioContext.session.project_id,
      appUserId: studioContext.session.sub,
      studioAuthorizationId: authorization?.authorizationId,
    })

    const record = await getImageGenerationById(id)
    logTaskSuccess('ImageAPI', 'generate', { generationId: id, provider: record?.provider })
    return created(c, record)
  } catch (err: any) {
    logTaskError('ImageAPI', 'generate', { error: err.message })
    return badRequest(c, err.message)
  }
})

// GET /images/:id
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const row = await getImageGenerationById(id)
  return success(c, row || null)
})

// GET /images — List by storyboard_id or drama_id
app.get('/', async (c) => {
  const storyboardId = c.req.query('storyboard_id')
  const dramaId = c.req.query('drama_id')

  const rows = await listImageGenerations({
    storyboardId: storyboardId ? Number(storyboardId) : undefined,
    dramaId: dramaId ? Number(dramaId) : undefined,
  })

  return success(c, rows)
})

// DELETE /images/:id
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await deleteImageGeneration(id)
  return success(c)
})

export default app
