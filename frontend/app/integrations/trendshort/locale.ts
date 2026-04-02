import { translateUiText } from '~/i18n/ui-copy'

const LOCALE_COOKIE = 'trendshort_studio_locale'

export type StudioLocale = 'en' | 'zh'

export function normalizeLocale(value?: string | null): StudioLocale {
  return value === 'zh' ? 'zh' : 'en'
}

export function parseLocaleFromUrl(value?: string | null): StudioLocale | null {
  if (!value) return null

  try {
    const pathname = new URL(value, 'http://localhost').pathname
    const maybeLocale = pathname.split('/')[1]
    return maybeLocale === 'zh' || maybeLocale === 'en' ? maybeLocale : null
  } catch {
    return null
  }
}

const messages = {
  en: {
    brandName: 'TrendShort Studio',
    brandSub: 'Studio Workspace',
    projects: 'Projects',
    settings: 'Settings',
    backToTrendShort: 'Back to TrendShort',
    handoffTitle: 'Connecting your Studio session...',
    handoffDescription: 'Please wait while TrendShort opens your short drama workspace.',
    handoffMissingTitle: 'Open this workspace from TrendShort',
    handoffMissingDescription: 'This Studio entry point expects a signed TrendShort handoff link.',
    handoffErrorTitle: 'Studio handoff failed',
    handoffErrorDescription: 'TrendShort could not establish a Studio session.',
    languageEnglish: 'EN',
    languageChinese: '中文',
  },
  zh: {
    brandName: 'TrendShort Studio',
    brandSub: '短剧工作台',
    projects: '项目',
    settings: '设置',
    backToTrendShort: '返回 TrendShort',
    handoffTitle: '正在连接 Studio 会话...',
    handoffDescription: 'TrendShort 正在为你打开短剧工作台，请稍候。',
    handoffMissingTitle: '请从 TrendShort 打开此工作台',
    handoffMissingDescription: '这个 Studio 入口需要由 TrendShort 签名跳转进入。',
    handoffErrorTitle: 'Studio 连接失败',
    handoffErrorDescription: 'TrendShort 暂时无法建立 Studio 会话。',
    languageEnglish: 'EN',
    languageChinese: '中文',
  },
} as const

export function useStudioLocale() {
  const localeCookie = useCookie<StudioLocale | undefined>(LOCALE_COOKIE, {
    sameSite: 'lax',
  })

  const locale = computed<StudioLocale>({
    get: () => normalizeLocale(localeCookie.value),
    set: (value) => {
      localeCookie.value = normalizeLocale(value)
    },
  })

  function syncLocale(...candidates: Array<string | null | undefined>) {
    if (localeCookie.value === 'en' || localeCookie.value === 'zh') {
      return localeCookie.value
    }

    for (const candidate of candidates) {
      const fromUrl = parseLocaleFromUrl(candidate)
      if (fromUrl) {
        locale.value = fromUrl
        return locale.value
      }

      if (candidate === 'en' || candidate === 'zh') {
        locale.value = candidate
        return locale.value
      }
    }

    locale.value = normalizeLocale(locale.value)
    return locale.value
  }

  function setLocale(value: StudioLocale) {
    locale.value = value
  }

  function tr(value: string) {
    return translateUiText(value, locale.value)
  }

  return {
    locale,
    t: computed(() => messages[locale.value]),
    syncLocale,
    setLocale,
    tr,
  }
}
