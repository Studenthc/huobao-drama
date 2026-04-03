import { Hono } from 'hono'
import { success, badRequest } from '../utils/response.js'
import { mergeEpisodeVideos } from '../services/ffmpeg-merge.js'
import { toSnakeCase } from '../utils/transform.js'
import { logTaskError, logTaskStart, logTaskSuccess } from '../utils/task-logger.js'
import { authorizeStudioAction, getStudioContext } from '../integrations/trendshort/index.js'
import {
  getEpisodeById,
  listVideoMergesByEpisodeId,
} from '../db/repos/studio-content.js'

const app = new Hono()

// POST /episodes/:id/merge — 拼接全集视频
app.post('/episodes/:id/merge', async (c) => {
  const episodeId = Number(c.req.param('id'))
  const ep = await getEpisodeById(episodeId)
  if (!ep) return badRequest(c, 'Episode not found')

  try {
    const studioContext = getStudioContext(c)
    logTaskStart('MergeAPI', 'episode-merge', { episodeId, dramaId: ep.dramaId })
    const authorization = await authorizeStudioAction(studioContext, 'merge_generation', {
      drama_id: ep.dramaId,
      episode_id: episodeId,
    })
    const mergeId = await mergeEpisodeVideos(episodeId, ep.dramaId, {
      appProjectId: studioContext.session.project_id,
      appUserId: studioContext.session.sub,
      studioAuthorizationId: authorization?.authorizationId,
    })
    logTaskSuccess('MergeAPI', 'episode-merge', { episodeId, mergeId })
    return success(c, { merge_id: mergeId, status: 'processing' })
  } catch (err: any) {
    logTaskError('MergeAPI', 'episode-merge', { episodeId, error: err.message })
    return badRequest(c, err.message)
  }
})

// GET /episodes/:id/merge — 查询拼接状态
app.get('/episodes/:id/merge', async (c) => {
  const episodeId = Number(c.req.param('id'))
  const merges = await listVideoMergesByEpisodeId(episodeId)

  const latest = merges[merges.length - 1]
  if (!latest) return success(c, null)

  return success(c, toSnakeCase(latest))
})

export default app
