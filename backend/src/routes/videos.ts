import { Hono } from 'hono'
import { success, created, badRequest } from '../utils/response.js'
import { generateVideo } from '../services/video-generation.js'
import { logTaskError, logTaskPayload, logTaskStart, logTaskSuccess } from '../utils/task-logger.js'
import { authorizeStudioAction, getStudioContext } from '../integrations/trendshort/index.js'
import {
  deleteVideoGeneration,
  getEpisodeById,
  getStoryboardById,
  getVideoGenerationById,
  listVideoGenerations,
} from '../db/repos/studio-content.js'

const app = new Hono()

// POST /videos — Generate video
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
        if (ep?.videoConfigId != null) configId = ep.videoConfigId
      }
    }

    logTaskStart('VideoAPI', 'generate', {
      storyboardId: body.storyboard_id,
      dramaId: body.drama_id,
      referenceMode: body.reference_mode,
      duration: body.duration,
    })
    logTaskPayload('VideoAPI', 'request body', body)
    const authorization = await authorizeStudioAction(studioContext, 'video_generation', {
      drama_id: body.drama_id,
      storyboard_id: body.storyboard_id,
      duration: body.duration,
      reference_mode: body.reference_mode,
    })
    const id = await generateVideo({
      storyboardId: body.storyboard_id,
      dramaId: body.drama_id,
      prompt: body.prompt,
      model: body.model,
      referenceMode: body.reference_mode,
      imageUrl: body.image_url,
      firstFrameUrl: body.first_frame_url,
      lastFrameUrl: body.last_frame_url,
      referenceImageUrls: body.reference_image_urls,
      duration: body.duration,
      aspectRatio: body.aspect_ratio,
      configId,
      appProjectId: studioContext.session.project_id,
      appUserId: studioContext.session.sub,
      studioAuthorizationId: authorization?.authorizationId,
    })

    const record = await getVideoGenerationById(id)
    logTaskSuccess('VideoAPI', 'generate', { generationId: id, provider: record?.provider })
    return created(c, record)
  } catch (err: any) {
    logTaskError('VideoAPI', 'generate', { error: err.message })
    return badRequest(c, err.message)
  }
})

// GET /videos/:id
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const row = await getVideoGenerationById(id)
  return success(c, row || null)
})

// GET /videos — List by storyboard_id or drama_id
app.get('/', async (c) => {
  const storyboardId = c.req.query('storyboard_id')
  const dramaId = c.req.query('drama_id')

  const rows = await listVideoGenerations({
    storyboardId: storyboardId ? Number(storyboardId) : undefined,
    dramaId: dramaId ? Number(dramaId) : undefined,
  })

  return success(c, rows)
})

// DELETE /videos/:id
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await deleteVideoGeneration(id)
  return success(c)
})

export default app
