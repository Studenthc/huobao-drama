/**
 * Vidu Webhook 回调处理
 * Vidu 在任务完成后会 POST 到此端点通知结果
 */
import { Hono } from 'hono'
import { success, badRequest } from '../utils/response.js'
import { downloadFile } from '../utils/storage.js'
import { ViduVideoAdapter } from '../services/adapters/vidu-video'
import { logTaskError, logTaskProgress, logTaskSuccess, logTaskWarn } from '../utils/task-logger.js'
import {
  getVideoGenerationByTaskId,
  updateStoryboard,
  updateVideoGeneration,
} from '../db/repos/studio-content.js'

const app = new Hono()

// POST /webhooks/vidu
// Vidu 回调格式: { task_id, state, video_url, ... }
app.post('/vidu', async (c) => {
  const body = await c.req.json()
  const { task_id, state, video_url, error } = body
  logTaskProgress('Webhook', 'vidu-callback', {
    taskId: task_id,
    state,
    hasVideoUrl: !!video_url,
    error,
  })

  if (!task_id) {
    logTaskWarn('Webhook', 'vidu-callback-missing-task-id', { state })
    return badRequest(c, 'Missing task_id')
  }

  // 查找对应的 video_generation 记录
  const record = await getVideoGenerationByTaskId(task_id)
  if (!record) {
    // 可能任务还没写入（极少见），返回成功避免重复回调
    logTaskWarn('Webhook', 'vidu-task-not-found', { taskId: task_id })
    return success(c, { message: 'Task not found' })
  }

  if (state === 'success' && video_url) {
    try {
      const localPath = await downloadFile(video_url, 'videos')
      await updateVideoGeneration(record.id, {
        videoUrl: video_url,
        localPath,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      })

      // 更新 storyboard
      if (record.storyboardId) {
        await updateStoryboard(record.storyboardId, {
          videoUrl: localPath,
          updatedAt: new Date().toISOString(),
        })
      }

      logTaskSuccess('Webhook', 'vidu-video-updated', {
        taskId: task_id,
        generationId: record.id,
        storyboardId: record.storyboardId,
        localPath,
      })
      return success(c, { message: 'Video updated successfully' })
    } catch (err: any) {
      logTaskError('Webhook', 'vidu-download-failed', { taskId: task_id, generationId: record.id, error: err.message })
      await updateVideoGeneration(record.id, {
        status: 'failed',
        errorMsg: `Webhook download failed: ${err.message}`,
      })
      return badRequest(c, err.message)
    }
  }

  if (state === 'failed') {
    logTaskError('Webhook', 'vidu-generation-failed', { taskId: task_id, generationId: record.id, error: error || 'Vidu generation failed' })
    await updateVideoGeneration(record.id, {
      status: 'failed',
      errorMsg: error || 'Vidu generation failed',
    })
    return success(c, { message: 'Error recorded' })
  }

  // 其他状态（processing 等），不处理
  logTaskProgress('Webhook', 'vidu-status-noted', { taskId: task_id, generationId: record.id, state })
  return success(c, { message: 'Status noted' })
})

export default app
