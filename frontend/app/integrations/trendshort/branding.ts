import type { Ref } from 'vue'
import type { StudioLocale } from './locale'

export function useTrendShortBranding(locale: Ref<StudioLocale>) {
  return computed(() => ({
    brandName: 'TrendShort Studio',
    brandSub: locale.value === 'en' ? 'Studio Workspace' : '短剧工作台',
  }))
}
