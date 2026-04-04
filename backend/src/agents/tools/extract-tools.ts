/**
 * 角色/场景提取 Agent 工具
 * 工厂函数模式 — 注入 episodeId + dramaId
 *
 * 单 Agent 一步流程：
 * 1. 读取剧本内容
 * 2. 读取项目中已存在的角色/场景（用于去重）
 * 3. 提取角色/场景并智能去重后直接保存
 */
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { now } from '../../utils/response.js'
import { logTaskProgress, logTaskSuccess } from '../../utils/task-logger.js'
import {
  createCharacter,
  createScene,
  ensureEpisodeCharacterLink,
  ensureEpisodeSceneLink,
  getEpisodeById,
  listCharactersByDramaId,
  listEpisodeCharacterLinks,
  listEpisodeSceneLinks,
  listScenesByDramaId,
  updateCharacter,
} from '../../db/repos/studio-content.js'

// ─── 关联辅助 ────────────────────────────────────────────────
async function linkCharToEpisode(episodeId: number, characterId: number) {
  const ts = now()
  await ensureEpisodeCharacterLink(episodeId, characterId, ts)
}

async function linkSceneToEpisode(episodeId: number, sceneId: number) {
  const ts = now()
  await ensureEpisodeSceneLink(episodeId, sceneId, ts)
}

export function createExtractTools(episodeId: number, dramaId: number) {

  // 1. 读取剧本内容
  const readScriptForExtraction = createTool({
    id: 'read_script_for_extraction',
    description: 'Read the formatted screenplay for character/scene extraction.',
    inputSchema: z.object({}),
    execute: async () => {
      const ep = await getEpisodeById(episodeId)
      if (!ep) return { error: 'Episode not found' }
      const content = ep.scriptContent || ep.content
      if (!content) return { error: 'Episode has no script content' }
      logTaskSuccess('ExtractTool', 'read-script', { episodeId, dramaId, scriptLength: content.length })
      return { script: content }
    },
  })

  // 2. 读取项目中已存在的角色（用于去重判断）
  const readExistingCharacters = createTool({
    id: 'read_existing_characters',
    description: 'Read all characters already existing in this drama project (for deduplication).',
    inputSchema: z.object({}),
    execute: async () => {
      const links = await listEpisodeCharacterLinks(episodeId)
      const linkedIds = new Set(
        links.map(link => link.characterId),
      )
      const chars = (await listCharactersByDramaId(dramaId))
        .filter(c => !c.deletedAt)
      const payload = {
        count: chars.length,
        characters: chars,
        current_episode_characters: chars.filter(c => linkedIds.has(c.id)),
      }
      logTaskSuccess('ExtractTool', 'read-characters', {
        episodeId,
        dramaId,
        projectCharacters: payload.count,
        episodeCharacters: payload.current_episode_characters.length,
      })
      return payload
    },
  })

  // 3. 读取项目中已存在的场景（用于去重判断）
  const readExistingScenes = createTool({
    id: 'read_existing_scenes',
    description: 'Read all scenes already existing in this drama project (for deduplication).',
    inputSchema: z.object({}),
    execute: async () => {
      const links = await listEpisodeSceneLinks(episodeId)
      const linkedIds = new Set(
        links.map(link => link.sceneId),
      )
      const scenes = (await listScenesByDramaId(dramaId))
        .filter(s => !s.deletedAt)
      const payload = {
        count: scenes.length,
        scenes,
        current_episode_scenes: scenes.filter(s => linkedIds.has(s.id)),
      }
      logTaskSuccess('ExtractTool', 'read-scenes', {
        episodeId,
        dramaId,
        projectScenes: payload.count,
        episodeScenes: payload.current_episode_scenes.length,
      })
      return payload
    },
  })

  // 4. 智能保存角色（按名字去重，与现有数据合并）
  const saveDedupCharacters = createTool({
    id: 'save_dedup_characters',
    description: 'Save extracted characters with deduplication. Existing characters (same name) are merged/updated; new ones are created. All are linked to the current episode.',
    inputSchema: z.object({
      characters: z.array(z.object({
        name: z.string(),
        role: z.string().optional(),
        description: z.string().optional(),
        appearance: z.string().optional(),
        personality: z.string().optional(),
      })),
    }),
    execute: async ({ characters }) => {
      const ts = now()
      const results = { created: 0, merged: 0 }
      logTaskProgress('ExtractTool', 'save-characters-begin', {
        episodeId,
        dramaId,
        names: characters.map(char => char.name).join(','),
      })

      for (const char of characters) {
        const existing = (await listCharactersByDramaId(dramaId))
          .filter(c => !c.deletedAt)
          .find(c => c.name === char.name)

        if (existing) {
          // 已存在：合并信息，保留 ID
          await updateCharacter(existing.id, {
            role: char.role || existing.role,
            description: char.description || existing.description,
            appearance: char.appearance || existing.appearance,
            personality: char.personality || existing.personality,
            updatedAt: ts,
          })
          await linkCharToEpisode(episodeId, existing.id)
          results.merged++
        } else {
          // 新增角色
          const created = await createCharacter({
            name: char.name,
            role: char.role || '',
            description: char.description || '',
            appearance: char.appearance || '',
            personality: char.personality || '',
            dramaId,
            createdAt: ts,
            updatedAt: ts,
          })
          await linkCharToEpisode(episodeId, created.id)
          results.created++
        }
      }

      const payload = {
        message: `角色保存完成：新增 ${results.created}，合并更新 ${results.merged}`,
        ...results,
      }
      logTaskSuccess('ExtractTool', 'save-characters-complete', { episodeId, ...results })
      return payload
    },
  })

  // 5. 智能保存场景（按地点+时间段去重，与现有数据合并）
  const saveDedupScenes = createTool({
    id: 'save_dedup_scenes',
    description: 'Save extracted scenes with deduplication. Existing scenes (same location+time) are reused; new ones are created. All are linked to the current episode.',
    inputSchema: z.object({
      scenes: z.array(z.object({
        location: z.string(),
        time: z.string().optional(),
        prompt: z.string().optional(),
      })),
    }),
    execute: async ({ scenes }) => {
      const ts = now()
      const results = { created: 0, reused: 0 }
      logTaskProgress('ExtractTool', 'save-scenes-begin', {
        episodeId,
        dramaId,
        scenes: scenes.map(scene => `${scene.location}@${scene.time || ''}`).join(','),
      })

      for (const scene of scenes) {
        // 按地点+时间段精确匹配
        const existingScenes = (await listScenesByDramaId(dramaId))
          .filter(s => !s.deletedAt)
        const existing = existingScenes
          .find(s => s.location === scene.location && s.time === (scene.time || ''))

        if (existing) {
          // 已存在完全匹配的场景：直接关联
          await linkSceneToEpisode(episodeId, existing.id)
          results.reused++
        } else {
          const created = await createScene({
            dramaId,
            location: scene.location,
            time: scene.time || '',
            prompt: scene.prompt || scene.location,
            createdAt: ts,
            updatedAt: ts,
          })
          await linkSceneToEpisode(episodeId, created.id)
          results.created++
        }
      }

      const payload = {
        message: `场景保存完成：新增 ${results.created}，复用已有 ${results.reused}`,
        ...results,
      }
      logTaskSuccess('ExtractTool', 'save-scenes-complete', { episodeId, ...results })
      return payload
    },
  })

  return {
    readScriptForExtraction,
    readExistingCharacters,
    readExistingScenes,
    saveDedupCharacters,
    saveDedupScenes,
  }
}
