import type { StudioLocale } from '~/composables/useStudioLocale'

type LocalizedValue = {
  en: string
  zh: string
}

const exactCopy: Record<string, LocalizedValue> = {
  'Projects': { en: 'Projects', zh: '项目' },
  'Settings': { en: 'Settings', zh: '设置' },
  'Back to TrendShort': { en: 'Back to TrendShort', zh: '返回 TrendShort' },
  'Studio Workspace': { en: 'Studio Workspace', zh: '短剧工作台' },
  '短剧项目': { en: 'Drama Projects', zh: '短剧项目' },
  '新建项目': { en: 'New Project', zh: '新建项目' },
  '新建第一个短剧项目': { en: 'Create your first drama project', zh: '新建第一个短剧项目' },
  '从剧本到成片，AI 助力的短剧制作工作台': {
    en: 'An AI-powered studio for turning scripts into finished short dramas.',
    zh: '从剧本到成片，AI 助力的短剧制作工作台',
  },
  '新建短剧项目': { en: 'Create a drama project', zh: '新建短剧项目' },
  '输入项目基本信息，即可开始制作': {
    en: 'Add the basics and start producing right away.',
    zh: '输入项目基本信息，即可开始制作',
  },
  '项目名称': { en: 'Project title', zh: '项目名称' },
  '计划集数': { en: 'Planned episodes', zh: '计划集数' },
  '视觉风格': { en: 'Visual style', zh: '视觉风格' },
  '选择风格': { en: 'Choose a style', zh: '选择风格' },
  '取消': { en: 'Cancel', zh: '取消' },
  '创建项目': { en: 'Create project', zh: '创建项目' },
  '删除': { en: 'Delete', zh: '删除' },
  '已删除': { en: 'Deleted', zh: '已删除' },
  '确定删除此镜头？': { en: 'Delete this shot?', zh: '确定删除此镜头？' },
  '返回': { en: 'Back', zh: '返回' },
  '返回项目': { en: 'Back to project', zh: '返回项目' },
  '刷新': { en: 'Refresh', zh: '刷新' },
  '刷新数据': { en: 'Refresh data', zh: '刷新数据' },
  '开始制作': { en: 'Start production', zh: '开始制作' },
  '查看成片': { en: 'View final cut', zh: '查看成片' },
  '继续制作': { en: 'Continue production', zh: '继续制作' },
  '上一步': { en: 'Previous', zh: '上一步' },
  '下一步': { en: 'Next', zh: '下一步' },
  '剧本': { en: 'Script', zh: '剧本' },
  '资产': { en: 'Assets', zh: '资产' },
  '镜头': { en: 'Shot', zh: '镜头' },
  '工作台': { en: 'Workspace', zh: '工作台' },
  '场景': { en: 'Scene', zh: '场景' },
  '添加集': { en: 'Add Episode', zh: '添加集' },
  '剧集列表': { en: 'Episodes', zh: '剧集列表' },
  '待编写': { en: 'Needs script', zh: '待编写' },
  '已完成剧本': { en: 'Script ready', zh: '已完成剧本' },
  '请先填写原始内容': { en: 'Fill in the source content first', zh: '请先填写原始内容' },
  '已跳过 AI 改写，当前将直接使用原始内容': { en: 'Skipped AI rewrite. The source content will be used directly.', zh: '已跳过 AI 改写，当前将直接使用原始内容' },
  '请先分配音色': { en: 'Assign voices first', zh: '请先分配音色' },
  '所有角色的试听文件已生成': { en: 'All voice samples are already generated', zh: '所有角色的试听文件已生成' },
  '试听已生成': { en: 'Voice sample generated', zh: '试听已生成' },
  '还没有可继续切割的宫格图': { en: 'No grid image is available to keep splitting yet', zh: '还没有可继续切割的宫格图' },
  '正在调用 AI 生成宫格提示词...': { en: 'Calling AI to generate the grid prompt...', zh: '正在调用 AI 生成宫格提示词...' },
  'AI 提示词已生成': { en: 'AI prompt generated', zh: 'AI 提示词已生成' },
  '已使用模板提示词': { en: 'Template prompt applied', zh: '已使用模板提示词' },
  '提示词生成失败': { en: 'Prompt generation failed', zh: '提示词生成失败' },
  '生成提示词失败': { en: 'Failed to generate the prompt', zh: '生成提示词失败' },
  '提交生成请求...': { en: 'Submitting generation request...', zh: '提交生成请求...' },
  '等待图片生成...': { en: 'Waiting for image generation...', zh: '等待图片生成...' },
  '生成失败': { en: 'Generation failed', zh: '生成失败' },
  '生成超时': { en: 'Generation timed out', zh: '生成超时' },
  '请至少分配一个格子': { en: 'Assign at least one cell first', zh: '请至少分配一个格子' },
  '切分分配完成': { en: 'Split assignment completed', zh: '切分分配完成' },
  '角色图片生成中': { en: 'Character image generation started', zh: '角色图片生成中' },
  '所有角色图片已生成': { en: 'All character images are already generated', zh: '所有角色图片已生成' },
  '角色图片批量生成中': { en: 'Batch character image generation started', zh: '角色图片批量生成中' },
  '场景图片生成中': { en: 'Scene image generation started', zh: '场景图片生成中' },
  '所有场景图片已生成': { en: 'All scene images are already generated', zh: '所有场景图片已生成' },
  '场景图片批量生成中': { en: 'Batch scene image generation started', zh: '场景图片批量生成中' },
  '所有镜头配音已生成': { en: 'All shot voice lines are already generated', zh: '所有镜头配音已生成' },
  '当前没有可生成的对白或旁白': { en: 'There is no dialogue or narration to generate yet', zh: '当前没有可生成的对白或旁白' },
  '首帧生成中': { en: 'First frame generation started', zh: '首帧生成中' },
  '尾帧生成中': { en: 'Last frame generation started', zh: '尾帧生成中' },
  '视频生成中': { en: 'Video generation started', zh: '视频生成中' },
  '视频生成完成': { en: 'Video generation completed', zh: '视频生成完成' },
  '视频生成失败': { en: 'Video generation failed', zh: '视频生成失败' },
  '视频生成超时': { en: 'Video generation timed out', zh: '视频生成超时' },
  '合成完成': { en: 'Composition completed', zh: '合成完成' },
  '批量合成已开始': { en: 'Batch composition started', zh: '批量合成已开始' },
  '拼接中...': { en: 'Merging...', zh: '拼接中...' },
  '拼接完成': { en: 'Merge completed', zh: '拼接完成' },
  '拼接失败': { en: 'Merge failed', zh: '拼接失败' },
  '视频合成失败': { en: 'Video composition failed', zh: '视频合成失败' },
  '批量合成完成': { en: 'Batch composition completed', zh: '批量合成完成' },
  '点击上方「添加集」创建第一集': { en: 'Click “Add Episode” above to create episode one.', zh: '点击上方「添加集」创建第一集' },
  'Episode Setup': { en: 'Episode Setup', zh: '集数配置' },
  '创建新集': { en: 'Create Episode', zh: '创建新集' },
  '配置将锁定': { en: 'Config will lock', zh: '配置将锁定' },
  '为这一集预先锁定图片、视频和音频生成服务。创建后，这些生成链路将始终跟随当前集配置。': {
    en: 'Preselect the image, video, and audio services for this episode. Once created, the episode stays locked to this setup.',
    zh: '为这一集预先锁定图片、视频和音频生成服务。创建后，这些生成链路将始终跟随当前集配置。',
  },
  '图片': { en: 'Image', zh: '图片' },
  '视频': { en: 'Video', zh: '视频' },
  '音频': { en: 'Audio', zh: '音频' },
  '仅首帧': { en: 'First frame only', zh: '仅首帧' },
  '多参考': { en: 'Multiple refs', zh: '多参考' },
  '首': { en: 'First', zh: '首' },
  '尾': { en: 'Last', zh: '尾' },
  '参': { en: 'Ref', zh: '参' },
  '未分配': { en: 'Unassigned', zh: '未分配' },
  '请选择一个镜头': { en: 'Select one shot', zh: '请选择一个镜头' },
  '请选择镜头': { en: 'Select shots', zh: '请选择镜头' },
  '可选': { en: 'available', zh: '可选' },
  '基础信息': { en: 'Basics', zh: '基础信息' },
  '这一项只影响显示名称，不影响生成配置': {
    en: 'This only changes the display title and does not affect generation settings.',
    zh: '这一项只影响显示名称，不影响生成配置',
  },
  '标题': { en: 'Title', zh: '标题' },
  '默认按集数自动命名': { en: 'Auto-name from the episode number', zh: '默认按集数自动命名' },
  '留空时会自动按集数命名，例如“第 3 集”。': {
    en: 'Leave blank to auto-name by episode number, for example “Episode 3”.',
    zh: '留空时会自动按集数命名，例如“第 3 集”。',
  },
  '生成配置': { en: 'Generation config', zh: '生成配置' },
  '创建后不可更改，建议在这里一次性选对': {
    en: 'This cannot be changed after creation, so choose carefully here.',
    zh: '创建后不可更改，建议在这里一次性选对',
  },
  '图片配置': { en: 'Image config', zh: '图片配置' },
  '视频配置': { en: 'Video config', zh: '视频配置' },
  '音频配置': { en: 'Audio config', zh: '音频配置' },
  '选择图片服务': { en: 'Choose image service', zh: '选择图片服务' },
  '选择视频服务': { en: 'Choose video service', zh: '选择视频服务' },
  '选择音频服务': { en: 'Choose audio service', zh: '选择音频服务' },
  '创建后，工作台中的图片、视频、音频生成入口都会锁定到当前集。': {
    en: 'After creation, all image, video, and audio generation in the workspace will stay locked to this episode.',
    zh: '创建后，工作台中的图片、视频、音频生成入口都会锁定到当前集。',
  },
  '创建中...': { en: 'Creating...', zh: '创建中...' },
  '创建并锁定配置': { en: 'Create and lock config', zh: '创建并锁定配置' },
  '已添加新集': { en: 'Episode added', zh: '已添加新集' },
  '基础': { en: 'Basic', zh: '基础' },
  '高级': { en: 'Advanced', zh: '高级' },
  'Agent 高级配置': { en: 'Advanced agent config', zh: 'Agent 高级配置' },
  '仅展开 Agent 配置与 Skills。工作台功能和分镜字段保持默认可见。': {
    en: 'Only expand Agent config and Skills. Core workspace features and storyboard fields stay visible by default.',
    zh: '仅展开 Agent 配置与 Skills。工作台功能和分镜字段保持默认可见。',
  },
  'AI 服务配置': { en: 'AI Services', zh: 'AI 服务配置' },
  '先用推荐模板快速落配置，再按服务类型微调。工作台创建集时会锁定所选图片、视频和音频能力。': {
    en: 'Start with the recommended template, then fine-tune by service type. Episode creation locks the chosen image, video, and audio stack.',
    zh: '先用推荐模板快速落配置，再按服务类型微调。工作台创建集时会锁定所选图片、视频和音频能力。',
  },
  'Huobao Shorts': { en: 'Huobao Shorts', zh: '火宝短剧' },
  '火宝短剧': { en: 'Huobao Shorts', zh: '火宝短剧' },
  'AI 服务': { en: 'AI Services', zh: 'AI 服务' },
  'Quick Setup': { en: 'Quick Setup', zh: '快捷配置' },
  '快捷配置': { en: 'Quick Setup', zh: '快捷配置' },
  '火宝推荐配置': { en: 'Huobao recommended stack', zh: '火宝推荐配置' },
  '一键写入文本、图片、视频、音频四类推荐配置，适合作为开箱默认方案。': {
    en: 'Create the recommended text, image, video, and audio configs in one click as the default starter stack.',
    zh: '一键写入文本、图片、视频、音频四类推荐配置，适合作为开箱默认方案。',
  },
  '火宝一键配置': { en: 'Apply Huobao preset', zh: '火宝一键配置' },
  '快捷模板': { en: 'Quick templates', zh: '快捷模板' },
  '选择服务类型后，直接用模板填充推荐的 `provider / base URL / model`。': {
    en: 'Choose a service type and autofill the recommended provider, base URL, and model from a template.',
    zh: '选择服务类型后，直接用模板填充推荐的 `provider / base URL / model`。',
  },
  '已启用': { en: 'active', zh: '已启用' },
  '添加': { en: 'Add', zh: '添加' },
  '未设置 Base URL': { en: 'Base URL not set', zh: '未设置 Base URL' },
  '已配置': { en: 'Configured', zh: '已配置' },
  '无密钥': { en: 'Missing key', zh: '无密钥' },
  '测试': { en: 'Test', zh: '测试' },
  '暂无配置': { en: 'No config yet', zh: '暂无配置' },
  'Agent 配置': { en: 'Agent Config', zh: 'Agent 配置' },
  '剧本改写': { en: 'Script Rewrite', zh: '剧本改写' },
  '角色场景提取': { en: 'Character & Scene Extraction', zh: '角色场景提取' },
  '分镜拆解': { en: 'Storyboard Breakdown', zh: '分镜拆解' },
  '音色分配': { en: 'Voice Assignment', zh: '音色分配' },
  '图片提示词生成': { en: 'Image Prompt Generation', zh: '图片提示词生成' },
  '高级区只保留 Agent 运行配置。这里可以调整模型、提示词和参数，保存后立即生效。': {
    en: 'The advanced area only keeps Agent runtime config. Adjust models, prompts, and parameters here and save to apply immediately.',
    zh: '高级区只保留 Agent 运行配置。这里可以调整模型、提示词和参数，保存后立即生效。',
  },
  '默认': { en: 'Default', zh: '默认' },
  '模型': { en: 'Model', zh: '模型' },
  '(留空使用 AI 服务默认)': { en: '(leave blank to use the AI service default)', zh: '(留空使用 AI 服务默认)' },
  '— 使用 AI 服务默认 —': { en: '— Use AI service default —', zh: '— 使用 AI 服务默认 —' },
  'System Prompt': { en: 'System Prompt', zh: '系统提示词' },
  'Agent 系统提示词...': { en: 'Agent system prompt...', zh: 'Agent 系统提示词...' },
  '恢复默认': { en: 'Reset to default', zh: '恢复默认' },
  '已保存': { en: 'Saved', zh: '已保存' },
  '保存': { en: 'Save', zh: '保存' },
  '测试配置': { en: 'Test Config', zh: '测试配置' },
  'Agent 列表': { en: 'Agent List', zh: 'Agent 列表' },
  'Skills': { en: 'Skills', zh: 'Skills' },
  'Skills 仅作为 Agent 的高级提示词层使用，不影响工作台常规功能入口。': {
    en: 'Skills act as an advanced prompt layer for Agents and do not affect the normal workspace entry points.',
    zh: 'Skills 仅作为 Agent 的高级提示词层使用，不影响工作台常规功能入口。',
  },
  '暂无 Skill': { en: 'No Skills yet', zh: '暂无 Skill' },
  '点击右上角「新增 Skill」创建第一个提示词文件': {
    en: 'Use “New Skill” in the upper-right corner to create your first prompt file.',
    zh: '点击右上角「新增 Skill」创建第一个提示词文件',
  },
  '编写 SKILL.md 内容...': { en: 'Write the SKILL.md content...', zh: '编写 SKILL.md 内容...' },
  'Edit Config': { en: 'Edit Config', zh: '编辑配置' },
  'New Config': { en: 'New Config', zh: '新建配置' },
  '编辑服务配置': { en: 'Edit service config', zh: '编辑服务配置' },
  '推荐先选择模板，系统会自动填入更合理的 `Base URL` 与默认模型。': {
    en: 'Start from a template to autofill a better Base URL and default model.',
    zh: '推荐先选择模板，系统会自动填入更合理的 `Base URL` 与默认模型。',
  },
  '配置名称': { en: 'Config name', zh: '配置名称' },
  '如 火宝默认图像服务': { en: 'For example: Huobao default image service', zh: '如 火宝默认图像服务' },
  '服务商': { en: 'Provider', zh: '服务商' },
  '选择服务商': { en: 'Choose provider', zh: '选择服务商' },
  '优先级': { en: 'Priority', zh: '优先级' },
  '数值越高越优先。工作台默认会优先使用同类型里优先级最高的启用配置。': {
    en: 'Higher numbers take priority. The workspace prefers the highest-priority active config of the same type.',
    zh: '数值越高越优先。工作台默认会优先使用同类型里优先级最高的启用配置。',
  },
  'API Key': { en: 'API Key', zh: 'API Key' },
  'Base URL': { en: 'Base URL', zh: 'Base URL' },
  '实际端点前缀：': { en: 'Resolved endpoint prefix:', zh: '实际端点前缀：' },
  '模型（逗号分隔）': { en: 'Models (comma separated)', zh: '模型（逗号分隔）' },
  '推荐': { en: 'Recommended', zh: '推荐' },
  'Huobao API Key': { en: 'Huobao API Key', zh: 'Huobao API Key' },
  '(统一用于文本 / 图片 / 视频 / 音频)': { en: '(used across text / image / video / audio)', zh: '(统一用于文本 / 图片 / 视频 / 音频)' },
  '用于 api.chatfire.site 全链路服务': { en: 'Used for the full api.chatfire.site stack', zh: '用于 api.chatfire.site 全链路服务' },
  '创建并启用': { en: 'Create and enable', zh: '创建并启用' },
  '新增 Skill': { en: 'New Skill', zh: '新增 Skill' },
  'Skill 目录名': { en: 'Skill folder name', zh: 'Skill 目录名' },
  '(英文，唯一)': { en: '(English, unique)', zh: '(英文，唯一)' },
  '如 custom-extraction': { en: 'For example: custom-extraction', zh: '如 custom-extraction' },
  '名称': { en: 'Name', zh: '名称' },
  '如 自定义提取规则': { en: 'For example: Custom extraction rules', zh: '如 自定义提取规则' },
  '描述': { en: 'Description', zh: '描述' },
  '简短描述此 Skill 的用途': { en: 'Briefly describe what this Skill does', zh: '简短描述此 Skill 的用途' },
  '创建': { en: 'Create', zh: '创建' },
  '文本': { en: 'Text', zh: '文本' },
  '剧本改写、角色场景提取、分镜拆解等 Agent 文本能力': {
    en: 'Text capabilities for script rewriting, character and scene extraction, and storyboard breakdown.',
    zh: '剧本改写、角色场景提取、分镜拆解等 Agent 文本能力',
  },
  '角色图、场景图、镜头图与首尾帧等静态图像生成': {
    en: 'Static image generation for characters, scenes, shots, and first/last frames.',
    zh: '角色图、场景图、镜头图与首尾帧等静态图像生成',
  },
  '镜头视频生成，支持单图、多图和首尾帧模式': {
    en: 'Shot video generation with single-image, multi-image, and first/last-frame modes.',
    zh: '镜头视频生成，支持单图、多图和首尾帧模式',
  },
  '角色试听、旁白与对白语音生成': {
    en: 'Voice sample, narration, and dialogue audio generation.',
    zh: '角色试听、旁白与对白语音生成',
  },
  '原始内容': { en: 'Source', zh: '原始内容' },
  'AI 改写': { en: 'AI Rewrite', zh: 'AI 改写' },
  '提取': { en: 'Extraction', zh: '提取' },
  '音色': { en: 'Voices', zh: '音色' },
  '分镜': { en: 'Storyboards', zh: '分镜' },
  '制作': { en: 'Production', zh: '制作' },
  '角色形象': { en: 'Character Art', zh: '角色形象' },
  '场景图片': { en: 'Scene Images', zh: '场景图片' },
  '配音生成': { en: 'Voice Generation', zh: '配音生成' },
  '镜头图片': { en: 'Shot Images', zh: '镜头图片' },
  '视频生成': { en: 'Video Generation', zh: '视频生成' },
  '视频合成': { en: 'Shot Compose', zh: '视频合成' },
  '导出': { en: 'Export', zh: '导出' },
  '拼接导出': { en: 'Merge Export', zh: '拼接导出' },
  '制作进度': { en: 'Progress', zh: '制作进度' },
  '粘贴小说原文、故事大纲或分镜描述...': {
    en: 'Paste a novel excerpt, story outline, or shot description...',
    zh: '粘贴小说原文、故事大纲或分镜描述...',
  },
  'AI 改写为格式化剧本': { en: 'Rewrite into a formatted script', zh: 'AI 改写为格式化剧本' },
  '你可以先用 AI 把原始内容整理成格式化剧本，也可以跳过这一步，直接使用原始内容继续提取角色与场景。': {
    en: 'Use AI to turn the source into a formatted script, or skip this step and continue extracting characters and scenes from the raw content.',
    zh: '你可以先用 AI 把原始内容整理成格式化剧本，也可以跳过这一步，直接使用原始内容继续提取角色与场景。',
  },
  '正在改写剧本...': { en: 'Rewriting script...', zh: '正在改写剧本...' },
  '格式化剧本内容...': { en: 'Formatted script content...', zh: '格式化剧本内容...' },
  '从剧本提取角色与场景': { en: 'Extract characters and scenes from the script', zh: '从剧本提取角色与场景' },
  '提取角色场景': { en: 'Extract characters & scenes', zh: '提取角色场景' },
  '提取角色与场景': { en: 'Extract characters and scenes', zh: '提取角色与场景' },
  '开始提取': { en: 'Start extraction', zh: '开始提取' },
  '分配音色': { en: 'Assign voices', zh: '分配音色' },
  'AI 自动分析剧本，提取角色信息和场景列表，与项目已有数据智能去重合并': {
    en: 'AI analyzes the script, extracts characters and scenes, and intelligently merges them with existing project data.',
    zh: 'AI 自动分析剧本，提取角色信息和场景列表，与项目已有数据智能去重合并',
  },
  '正在提取角色和场景...': { en: 'Extracting characters and scenes...', zh: '正在提取角色和场景...' },
  'Extraction Board': { en: 'Extraction Board', zh: '提取总览' },
  '角色与场景结果': { en: 'Characters and scenes', zh: '角色与场景结果' },
  '从剧本里提取出的角色和场景已经入库。这里先确认命名、定位和描述是否可直接进入后续制作。': {
    en: 'Extracted characters and scenes are now saved. Review names, roles, and descriptions before moving into production.',
    zh: '从剧本里提取出的角色和场景已经入库。这里先确认命名、定位和描述是否可直接进入后续制作。',
  },
  '如果角色描述过于简短，后续分配音色和生成形象时建议先补充人物特征。': {
    en: 'If the character descriptions are too short, enrich them before assigning voices or generating visuals.',
    zh: '如果角色描述过于简短，后续分配音色和生成形象时建议先补充人物特征。',
  },
  '暂无描述': { en: 'No description yet', zh: '暂无描述' },
  '等待补充场景描述': { en: 'Add a scene description', zh: '等待补充场景描述' },
  '未设时间': { en: 'Time not set', zh: '未设时间' },
  '为角色分配合适的音色': { en: 'Assign voices to characters', zh: '为角色分配合适的音色' },
  'AI 根据角色特征自动分配最匹配的 TTS 音色': {
    en: 'AI assigns the most suitable TTS voice based on each character profile.',
    zh: 'AI 根据角色特征自动分配最匹配的 TTS 音色',
  },
  '正在分配音色...': { en: 'Assigning voices...', zh: '正在分配音色...' },
  'Voice Casting': { en: 'Voice Casting', zh: '声音分配' },
  '角色声音分配台': { en: 'Character voice desk', zh: '角色声音分配台' },
  '先为每个角色选择合适音色，再生成试听。音色标签会帮助你快速区分旁白、主角、反派和配角的表达方向。': {
    en: 'Pick the right voice for each character first, then generate samples. Voice tags help distinguish narrators, leads, villains, and side characters quickly.',
    zh: '先为每个角色选择合适音色，再生成试听。音色标签会帮助你快速区分旁白、主角、反派和配角的表达方向。',
  },
  '已分配': { en: 'Assigned', zh: '已分配' },
  '试听文件': { en: 'Samples', zh: '试听文件' },
  '音色库': { en: 'Voice library', zh: '音色库' },
  '暂无角色描述，可根据人物定位手动挑选音色。': {
    en: 'No character description yet. You can still pick a voice manually based on the role.',
    zh: '暂无角色描述，可根据人物定位手动挑选音色。',
  },
  '选择音色': { en: 'Choose voice', zh: '选择音色' },
  '生成后可快速确认角色声音': { en: 'Generate a sample to quickly validate the voice.', zh: '生成后可快速确认角色声音' },
  '已生成声音样本，可直接播放': { en: 'Sample ready to play.', zh: '已生成声音样本，可直接播放' },
  '镜头序列': { en: 'Shot sequence', zh: '镜头序列' },
  '按镜头顺序检查内容与素材状态': { en: 'Review content and asset status shot by shot.', zh: '按镜头顺序检查内容与素材状态' },
  '无描述': { en: 'No description', zh: '无描述' },
  '镜头概览': { en: 'Shot overview', zh: '镜头概览' },
  '当前镜头还没有画面描述，建议先补充核心动作和构图。': {
    en: 'This shot does not have a visual description yet. Add the key action and framing first.',
    zh: '当前镜头还没有画面描述，建议先补充核心动作和构图。',
  },
  '首帧': { en: 'First frame', zh: '首帧' },
  '尾帧': { en: 'Last frame', zh: '尾帧' },
  '待生成': { en: 'Pending', zh: '待生成' },
  '镜头结构': { en: 'Shot structure', zh: '镜头结构' },
  '景别、角度、运镜、场景绑定和时长': { en: 'Frame size, angle, movement, scene binding, and duration.', zh: '景别、角度、运镜、场景绑定和时长' },
  '景别': { en: 'Shot size', zh: '景别' },
  '选择或输入景别': { en: 'Choose or type a shot size', zh: '选择或输入景别' },
  '角度': { en: 'Angle', zh: '角度' },
  '选择或输入角度': { en: 'Choose or type an angle', zh: '选择或输入角度' },
  '运镜': { en: 'Movement', zh: '运镜' },
  '选择或输入运镜': { en: 'Choose or type camera movement', zh: '选择或输入运镜' },
  '绑定角色': { en: 'Characters', zh: '绑定角色' },
  '当前集还没有角色': { en: 'No characters in this episode yet.', zh: '当前集还没有角色' },
  '绑定场景': { en: 'Scene binding', zh: '绑定场景' },
  '未绑定场景': { en: 'No scene linked', zh: '未绑定场景' },
  '地点': { en: 'Location', zh: '地点' },
  '场景地点': { en: 'Scene location', zh: '场景地点' },
  '时间': { en: 'Time', zh: '时间' },
  '如：深夜 / 清晨': { en: 'For example: late night / dawn', zh: '如：深夜 / 清晨' },
  '时长': { en: 'Duration', zh: '时长' },
  '画面语义': { en: 'Visual semantics', zh: '画面语义' },
  '动作、结果、氛围和对白': { en: 'Action, result, mood, and dialogue.', zh: '动作、结果、氛围和对白' },
  '动作': { en: 'Action', zh: '动作' },
  '谁在做什么，表情和动作细节是什么': { en: 'Who is doing what, and what are the facial and motion details?', zh: '谁在做什么，表情和动作细节是什么' },
  '结果': { en: 'Result', zh: '结果' },
  '镜头结束时的状态变化或画面结果': { en: 'What changes or visual result should be visible at the end of the shot?', zh: '镜头结束时的状态变化或画面结果' },
  '画面描述': { en: 'Visual description', zh: '画面描述' },
  '描述画面内容...': { en: 'Describe the frame...', zh: '描述画面内容...' },
  '氛围': { en: 'Mood', zh: '氛围' },
  '光线、色调、空气感、环境氛围': { en: 'Lighting, color, atmosphere, and environmental feel.', zh: '光线、色调、空气感、环境氛围' },
  '对白 / 旁白': { en: 'Dialogue / narration', zh: '对白 / 旁白' },
  '角色名：台词内容 或 旁白：内容': { en: 'Character: dialogue or Narration: text', zh: '角色名：台词内容 或 旁白：内容' },
  '生成提示': { en: 'Generation prompts', zh: '生成提示' },
  '分别服务图片、视频、配乐和音效生成': { en: 'Separate prompts for image, video, music, and sound design.', zh: '分别服务图片、视频、配乐和音效生成' },
  '静态画面提示词': { en: 'Static image prompt', zh: '静态画面提示词' },
  '用于首帧、尾帧和镜头图片的单帧画面提示词': { en: 'Prompt for first frame, last frame, and shot still images.', zh: '用于首帧、尾帧和镜头图片的单帧画面提示词' },
  '视频提示词': { en: 'Video prompt', zh: '视频提示词' },
  '按 3 秒分段的视频提示词...': { en: 'Video prompt split into 3-second beats...', zh: '按 3 秒分段的视频提示词...' },
  '配乐提示词': { en: 'Music prompt', zh: '配乐提示词' },
  '如：压抑低频弦乐，缓慢推进': { en: 'For example: tense low strings with a slow build', zh: '如：压抑低频弦乐，缓慢推进' },
  '音效提示词': { en: 'Sound design prompt', zh: '音效提示词' },
  '如：风雪声、脚踩积雪、衣料摩擦声': { en: 'For example: wind, snow crunch, fabric rustle', zh: '如：风雪声、脚踩积雪、衣料摩擦声' },
  '正在拆解分镜并生成提示词...': { en: 'Breaking the script into shots and prompts...', zh: '正在拆解分镜并生成提示词...' },
  '将剧本拆解为分镜序列': { en: 'Turn the script into a shot sequence', zh: '将剧本拆解为分镜序列' },
  '分镜列表': { en: 'Storyboard list', zh: '分镜列表' },
  'AI 拆解分镜': { en: 'AI storyboard breakdown', zh: 'AI 拆解分镜' },
  '进入制作': { en: 'Enter production', zh: '进入制作' },
  '未配置': { en: 'Not configured', zh: '未配置' },
  '视频模型 · 未配置': { en: 'Video model · Not configured', zh: '视频模型 · 未配置' },
  '当前集视频模型：未配置': { en: 'Episode video model: Not configured', zh: '当前集视频模型：未配置' },
  'AI 自动分析剧本，生成镜头列表和视频提示词': { en: 'AI analyzes the script and generates a shot list and video prompts.', zh: 'AI 自动分析剧本，生成镜头列表和视频提示词' },
  '尚未准备就绪': { en: 'Not ready yet', zh: '尚未准备就绪' },
  '请先完成剧本编写': { en: 'Finish the script first.', zh: '请先完成剧本编写' },
  '请先完成分镜拆解': { en: 'Finish the storyboard breakdown first.', zh: '请先完成分镜拆解' },
  '前往剧本': { en: 'Go to script', zh: '前往剧本' },
  '制作工作台': { en: 'Production workspace', zh: '制作工作台' },
  '旁白仅保留声音': { en: 'Narration keeps audio only', zh: '旁白仅保留声音' },
  '已生成': { en: 'Ready', zh: '已生成' },
  '生成中': { en: 'Generating', zh: '生成中' },
  '生成': { en: 'Generate', zh: '生成' },
  '当前没有可生成的配音': { en: 'No voice lines available yet', zh: '当前没有可生成的配音' },
  '先在分镜里填写“角色名：台词”或“旁白：文案”，这里就会出现待生成的语音镜头。': {
    en: 'Add “Character: dialogue” or “Narration: line” in the storyboard, and the voice shots will appear here.',
    zh: '先在分镜里填写“角色名：台词”或“旁白：文案”，这里就会出现待生成的语音镜头。',
  },
  '未填写文本': { en: 'No text added', zh: '未填写文本' },
  '未设景别': { en: 'Shot size not set', zh: '未设景别' },
  '未设地点': { en: 'Location not set', zh: '未设地点' },
  '尚未生成语音文件': { en: 'No voice file yet', zh: '尚未生成语音文件' },
  '生成配音': { en: 'Generate voice', zh: '生成配音' },
  '帧模式': { en: 'Frame mode', zh: '帧模式' },
  '当前宫格图': { en: 'Current grid', zh: '当前宫格图' },
  '可继续切割并分配': { en: 'Ready to split and assign', zh: '可继续切割并分配' },
  '预览': { en: 'Preview', zh: '预览' },
  '继续切割': { en: 'Continue split', zh: '继续切割' },
  '历史宫格图': { en: 'Grid history', zh: '历史宫格图' },
  '按需展开切换不同宫格图，不默认占用第一屏': { en: 'Expand only when needed to switch grids without crowding the first screen.', zh: '按需展开切换不同宫格图，不默认占用第一屏' },
  '已恢复默认提示词，点击保存生效': { en: 'Default prompt restored. Save to apply it.', zh: '已恢复默认提示词，点击保存生效' },
  'Skill 创建成功': { en: 'Skill created', zh: 'Skill 创建成功' },
  '端点已响应': { en: 'Endpoint responded', zh: '端点已响应' },
  '端点未通过测试': { en: 'Endpoint test failed', zh: '端点未通过测试' },
  '请填写 Huobao API Key': { en: 'Please enter the Huobao API Key', zh: '请填写 Huobao API Key' },
  '火宝推荐配置与默认 Agent LLM 已写入': {
    en: 'Huobao preset configs and default Agent LLMs have been saved.',
    zh: '火宝推荐配置与默认 Agent LLM 已写入',
  },
  '配置已保存': { en: 'config saved', zh: '配置已保存' },
  '刚刚': { en: 'Just now', zh: '刚刚' },
  '中性': { en: 'Neutral', zh: '中性' },
  '男声': { en: 'Male', zh: '男声' },
  '女声': { en: 'Female', zh: '女声' },
}

const exactLookup = Object.values(exactCopy).reduce<Record<string, LocalizedValue>>((lookup, entry) => {
  lookup[entry.en] = entry
  lookup[entry.zh] = entry
  return lookup
}, { ...exactCopy })

const regexCopy: Array<{
  test: RegExp
  to: (locale: StudioLocale, match: RegExpExecArray) => string
}> = [
  {
    test: /^第\s*(\d+)\s*集$/,
    to: (locale, match) => (locale === 'en' ? `Episode ${match[1]}` : `第 ${match[1]} 集`),
  },
  {
    test: /^Episode\s+(\d+)$/,
    to: (locale, match) => (locale === 'en' ? `Episode ${match[1]}` : `第 ${match[1]} 集`),
  },
  {
    test: /^第(\d+)集$/,
    to: (locale, match) => (locale === 'en' ? `Episode ${match[1]}` : `第${match[1]}集`),
  },
  {
    test: /^(\d+)\s*个项目$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'project' : 'projects'}` : `${match[1]} 个项目`),
  },
  {
    test: /^(\d+)\s*projects$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'project' : 'projects'}` : `${match[1]} 个项目`),
  },
  {
    test: /^(\d+)\s*project$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'project' : 'projects'}` : `${match[1]} 个项目`),
  },
  {
    test: /^(\d+)\s*集$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'episode' : 'episodes'}` : `${match[1]} 集`),
  },
  {
    test: /^(\d+)\s*episodes$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'episode' : 'episodes'}` : `${match[1]} 集`),
  },
  {
    test: /^(\d+)\s*episode$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'episode' : 'episodes'}` : `${match[1]} 集`),
  },
  {
    test: /^(\d+)\s*EPISODES$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'EPISODE' : 'EPISODES'}` : `${match[1]} 集`),
  },
  {
    test: /^(\d+)\s*角色$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'character' : 'characters'}` : `${match[1]} 角色`),
  },
  {
    test: /^(\d+)\s*characters$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'character' : 'characters'}` : `${match[1]} 角色`),
  },
  {
    test: /^(\d+)\s*场景$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'scene' : 'scenes'}` : `${match[1]} 场景`),
  },
  {
    test: /^(\d+)\s*scenes$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'scene' : 'scenes'}` : `${match[1]} 场景`),
  },
  {
    test: /^(\d+)\s*scene$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} ${match[1] === '1' ? 'scene' : 'scenes'}` : `${match[1]} 场景`),
  },
  {
    test: /^(\d+)\s*角色\s*·\s*(\d+)\s*镜头$/,
    to: (locale, match) => (locale === 'en'
      ? `${match[1]} ${match[1] === '1' ? 'character' : 'characters'} · ${match[2]} ${match[2] === '1' ? 'shot' : 'shots'}`
      : `${match[1]} 角色 · ${match[2]} 镜头`),
  },
  {
    test: /^(\d+)\s*characters\s*·\s*(\d+)\s*shots$/,
    to: (locale, match) => (locale === 'en'
      ? `${match[1]} ${match[1] === '1' ? 'character' : 'characters'} · ${match[2]} ${match[2] === '1' ? 'shot' : 'shots'}`
      : `${match[1]} 角色 · ${match[2]} 镜头`),
  },
  {
    test: /^(\d+)\s*character\s*·\s*(\d+)\s*shot$/,
    to: (locale, match) => (locale === 'en'
      ? `${match[1]} ${match[1] === '1' ? 'character' : 'characters'} · ${match[2]} ${match[2] === '1' ? 'shot' : 'shots'}`
      : `${match[1]} 角色 · ${match[2]} 镜头`),
  },
  {
    test: /^(\d+)\s*分钟前$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} min ago` : `${match[1]} 分钟前`),
  },
  {
    test: /^(\d+)\s*min ago$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} min ago` : `${match[1]} 分钟前`),
  },
  {
    test: /^(\d+)\s*小时前$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} hr ago` : `${match[1]} 小时前`),
  },
  {
    test: /^(\d+)\s*hr ago$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} hr ago` : `${match[1]} 小时前`),
  },
  {
    test: /^(\d+)\s*天前$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} days ago` : `${match[1]} 天前`),
  },
  {
    test: /^(\d+)\s*days ago$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} days ago` : `${match[1]} 天前`),
  },
  {
    test: /^确定删除「(.+)」？此操作不可恢复。$/,
    to: (locale, match) => (locale === 'en' ? `Delete “${match[1]}”? This action cannot be undone.` : `确定删除「${match[1]}」？此操作不可恢复。`),
  },
  {
    test: /^Delete “(.+)”\? This action cannot be undone\.$/,
    to: (locale, match) => (locale === 'en' ? `Delete “${match[1]}”? This action cannot be undone.` : `确定删除「${match[1]}」？此操作不可恢复。`),
  },
  {
    test: /^确定删除 Skill「(.+)」？$/,
    to: (locale, match) => (locale === 'en' ? `Delete Skill “${match[1]}”?` : `确定删除 Skill「${match[1]}」？`),
  },
  {
    test: /^Delete Skill “(.+)”\?$/,
    to: (locale, match) => (locale === 'en' ? `Delete Skill “${match[1]}”?` : `确定删除 Skill「${match[1]}」？`),
  },
  {
    test: /^镜头 #(\d+)$/,
    to: (locale, match) => (locale === 'en' ? `Shot #${match[1]}` : `镜头 #${match[1]}`),
  },
  {
    test: /^Shot #(\d+)$/,
    to: (locale, match) => (locale === 'en' ? `Shot #${match[1]}` : `镜头 #${match[1]}`),
  },
  {
    test: /^首帧 (已生成|待生成)$/,
    to: (locale, match) => {
      const status = match[1] === '已生成' ? (locale === 'en' ? 'Ready' : '已生成') : (locale === 'en' ? 'Pending' : '待生成')
      return locale === 'en' ? `First frame ${status}` : `首帧 ${status}`
    },
  },
  {
    test: /^尾帧 (已生成|待生成)$/,
    to: (locale, match) => {
      const status = match[1] === '已生成' ? (locale === 'en' ? 'Ready' : '已生成') : (locale === 'en' ? 'Pending' : '待生成')
      return locale === 'en' ? `Last frame ${status}` : `尾帧 ${status}`
    },
  },
  {
    test: /^First frame (Ready|Pending)$/,
    to: (locale, match) => {
      const status = match[1] === 'Ready' ? (locale === 'en' ? 'Ready' : '已生成') : (locale === 'en' ? 'Pending' : '待生成')
      return locale === 'en' ? `First frame ${status}` : `首帧 ${status}`
    },
  },
  {
    test: /^Last frame (Ready|Pending)$/,
    to: (locale, match) => {
      const status = match[1] === 'Ready' ? (locale === 'en' ? 'Ready' : '已生成') : (locale === 'en' ? 'Pending' : '待生成')
      return locale === 'en' ? `Last frame ${status}` : `尾帧 ${status}`
    },
  },
  {
    test: /^视频 (已生成|待生成)$/,
    to: (locale, match) => {
      const status = match[1] === '已生成' ? (locale === 'en' ? 'Ready' : '已生成') : (locale === 'en' ? 'Pending' : '待生成')
      return locale === 'en' ? `Video ${status}` : `视频 ${status}`
    },
  },
  {
    test: /^Video (Ready|Pending)$/,
    to: (locale, match) => {
      const status = match[1] === 'Ready' ? (locale === 'en' ? 'Ready' : '已生成') : (locale === 'en' ? 'Pending' : '待生成')
      return locale === 'en' ? `Video ${status}` : `视频 ${status}`
    },
  },
  {
    test: /^已生成 (\d+) 份试听文件$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} voice samples generated` : `已生成 ${match[1]} 份试听文件`),
  },
  {
    test: /^(\d+) voice samples generated$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} voice samples generated` : `已生成 ${match[1]} 份试听文件`),
  },
  {
    test: /^(\d+) 份试听文件生成失败$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} voice samples failed` : `${match[1]} 份试听文件生成失败`),
  },
  {
    test: /^(\d+) voice samples failed$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} voice samples failed` : `${match[1]} 份试听文件生成失败`),
  },
  {
    test: /^已生成 (\d+) 条镜头配音$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} shot voice lines generated` : `已生成 ${match[1]} 条镜头配音`),
  },
  {
    test: /^(\d+) shot voice lines generated$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} shot voice lines generated` : `已生成 ${match[1]} 条镜头配音`),
  },
  {
    test: /^(\d+) 条镜头配音生成失败$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} shot voice lines failed` : `${match[1]} 条镜头配音生成失败`),
  },
  {
    test: /^(\d+) shot voice lines failed$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} shot voice lines failed` : `${match[1]} 条镜头配音生成失败`),
  },
  {
    test: /^有 (\d+) 个镜头合成失败$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} shot compositions failed` : `有 ${match[1]} 个镜头合成失败`),
  },
  {
    test: /^(\d+) shot compositions failed$/,
    to: (locale, match) => (locale === 'en' ? `${match[1]} shot compositions failed` : `有 ${match[1]} 个镜头合成失败`),
  },
]

export function translateUiText(value: string, locale: StudioLocale): string {
  const original = value.trim()
  if (!original) return value

  const exact = exactLookup[original]
  if (exact) {
    return value.replace(original, exact[locale])
  }

  for (const rule of regexCopy) {
    const match = rule.test.exec(original)
    if (match) {
      return value.replace(original, rule.to(locale, match))
    }
  }

  return value
}
