import { Hono } from 'hono'
import { db, schema } from '../db/index.js'
import { success, notFound, badRequest, now } from '../utils/response.js'
import { toSnakeCaseArray, toSnakeCase } from '../utils/transform.js'
import {
  createEpisode,
  listCharactersByDramaId,
  listEpisodeCharacterLinks,
  listEpisodeSceneLinks,
  listEpisodesByDramaIdOrdered,
  listScenesByDramaId,
  listStoryboardCharacterLinks,
  listStoryboardsByEpisodeIdOrdered,
  listVideoMergesByEpisodeId,
  updateEpisode,
} from '../db/repos/studio-content.js'
import { getScopedDrama, getScopedEpisode } from '../integrations/trendshort/scope.js'

const app = new Hono()

// POST /episodes — Create a new episode
app.post('/', async (c) => {
  const body = await c.req.json()
  if (!body.drama_id) return badRequest(c, 'drama_id required')
  const drama = await getScopedDrama(c, Number(body.drama_id))
  if (!drama) return notFound(c, '剧本不存在')
  const imageConfigId = body.image_config_id ?? null
  const videoConfigId = body.video_config_id ?? null
  const audioConfigId = body.audio_config_id ?? null
  const ts = now()

  // Get next episode number
  const existing = await listEpisodesByDramaIdOrdered(Number(body.drama_id))
  const nextNum = existing.length ? Math.max(...existing.map(e => e.episodeNumber)) + 1 : 1

  const ep = await createEpisode({
    dramaId: body.drama_id,
    episodeNumber: nextNum,
    title: body.title || `第${nextNum}集`,
    imageConfigId,
    videoConfigId,
    audioConfigId,
    createdAt: ts,
    updatedAt: ts,
  })
  if (!ep) return badRequest(c, 'Episode create failed')
  return success(c, {
    id: ep.id,
    episode_number: ep.episodeNumber,
    title: ep.title,
    image_config_id: ep.imageConfigId,
    video_config_id: ep.videoConfigId,
    audio_config_id: ep.audioConfigId,
  })
})

// PUT /episodes/:id - Update episode fields
app.put('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const episode = await getScopedEpisode(c, id)
  if (!episode) return notFound(c, 'Episode not found')
  const body = await c.req.json()

  const allowed = ['content', 'script_content', 'title', 'description', 'status']
  const updates: Record<string, any> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }
  if (Object.keys(updates).length === 0) return badRequest(c, 'no valid fields')

  // Map snake_case to camelCase for drizzle
  const drizzleUpdates: Record<string, any> = { updatedAt: now() }
  if ('content' in updates) drizzleUpdates.content = updates.content
  if ('script_content' in updates) drizzleUpdates.scriptContent = updates.script_content
  if ('title' in updates) drizzleUpdates.title = updates.title
  if ('description' in updates) drizzleUpdates.description = updates.description
  if ('status' in updates) drizzleUpdates.status = updates.status

  await updateEpisode(id, drizzleUpdates)
  return success(c)
})

// GET /episodes/:id/characters — characters linked to this episode
app.get('/:id/characters', async (c) => {
  const episodeId = Number(c.req.param('id'))
  const episode = await getScopedEpisode(c, episodeId)
  if (!episode) return notFound(c, 'Episode not found')
  const links = await listEpisodeCharacterLinks(episodeId)
  const charIds = links.map(l => l.characterId)
  if (!charIds.length) return success(c, [])
  const allChars = await listCharactersByDramaId(episode.dramaId)
  const result = allChars.filter(ch => charIds.includes(ch.id) && !ch.deletedAt)
  return success(c, toSnakeCaseArray(result))
})

// GET /episodes/:id/scenes — scenes linked to this episode
app.get('/:id/scenes', async (c) => {
  const episodeId = Number(c.req.param('id'))
  const episode = await getScopedEpisode(c, episodeId)
  if (!episode) return notFound(c, 'Episode not found')
  const links = await listEpisodeSceneLinks(episodeId)
  const sceneIds = links.map(l => l.sceneId)
  if (!sceneIds.length) return success(c, [])
  const allScenes = await listScenesByDramaId(episode.dramaId)
  const result = allScenes.filter(sc => sceneIds.includes(sc.id) && !sc.deletedAt)
  return success(c, toSnakeCaseArray(result))
})

// GET /episodes/:episode_id/storyboards
app.get('/:episode_id/storyboards', async (c) => {
  const episodeId = Number(c.req.param('episode_id'))
  const episode = await getScopedEpisode(c, episodeId)
  if (!episode) return notFound(c, 'Episode not found')
  const rows = await listStoryboardsByEpisodeIdOrdered(episodeId)
  const links = await listStoryboardCharacterLinks()
  const charIdsByStoryboard = new Map<number, number[]>()
  for (const link of links) {
    const arr = charIdsByStoryboard.get(link.storyboardId) || []
    arr.push(link.characterId)
    charIdsByStoryboard.set(link.storyboardId, arr)
  }

  const episodeCharIds = (await listEpisodeCharacterLinks(episodeId)).map(link => link.characterId)
  const allChars = (await listCharactersByDramaId(episode.dramaId))
    .filter(ch => episodeCharIds.includes(ch.id) && !ch.deletedAt)

  return success(c, rows.map((row) => ({
    ...toSnakeCase(row),
    character_ids: charIdsByStoryboard.get(row.id) || [],
    characters: allChars
      .filter(ch => (charIdsByStoryboard.get(row.id) || []).includes(ch.id))
      .map(ch => toSnakeCase(ch)),
  })))
})

// GET /episodes/:id/pipeline-status — 流水线进度
app.get('/:id/pipeline-status', async (c) => {
  const episodeId = Number(c.req.param('id'))
  const ep = await getScopedEpisode(c, episodeId)
  if (!ep) return notFound(c, 'Episode not found')

  const [chars, scenes, sbs, merges] = await Promise.all([
    listCharactersByDramaId(ep.dramaId),
    listScenesByDramaId(ep.dramaId),
    listStoryboardsByEpisodeIdOrdered(episodeId),
    listVideoMergesByEpisodeId(episodeId),
  ])

  const charsWithVoice = chars.filter(c => c.voiceStyle)
  const charsWithSample = chars.filter(c => c.voiceSampleUrl)
  const sbsWithImage = sbs.filter(s => s.composedImage)
  const sbsWithVideo = sbs.filter(s => s.videoUrl)
  const sbsComposed = sbs.filter(s => s.composedVideoUrl)
  const latestMerge = merges[merges.length - 1]

  function stepStatus(done: boolean, partial?: boolean) {
    if (done) return 'done'
    if (partial) return 'partial'
    return 'pending'
  }

  return success(c, {
    episode_id: episodeId,
    steps: {
      script_rewrite: { status: ep.scriptContent ? 'done' : (ep.content ? 'ready' : 'pending') },
      extract_characters: { status: stepStatus(chars.length > 0), count: chars.length },
      extract_scenes: { status: stepStatus(scenes.length > 0), count: scenes.length },
      assign_voices: { status: stepStatus(charsWithVoice.length === chars.length && chars.length > 0, charsWithVoice.length > 0), assigned: charsWithVoice.length, total: chars.length },
      generate_voice_samples: { status: stepStatus(charsWithSample.length === charsWithVoice.length && charsWithVoice.length > 0, charsWithSample.length > 0), completed: charsWithSample.length, total: charsWithVoice.length },
      extract_storyboards: { status: stepStatus(sbs.length > 0), count: sbs.length },
      generate_images: { status: stepStatus(sbsWithImage.length === sbs.length && sbs.length > 0, sbsWithImage.length > 0), completed: sbsWithImage.length, total: sbs.length },
      generate_videos: { status: stepStatus(sbsWithVideo.length === sbs.length && sbs.length > 0, sbsWithVideo.length > 0), completed: sbsWithVideo.length, total: sbs.length },
      compose_shots: { status: stepStatus(sbsComposed.length === sbs.length && sbs.length > 0, sbsComposed.length > 0), completed: sbsComposed.length, total: sbs.length },
      merge_episode: { status: latestMerge?.status === 'completed' ? 'done' : (latestMerge ? latestMerge.status : 'pending'), merged_url: latestMerge?.mergedUrl },
    },
  })
})

export default app
