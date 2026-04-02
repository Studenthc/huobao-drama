import { translateUiText } from '~/i18n/ui-copy'
import { useStudioLocale } from '~/composables/useStudioLocale'

function translateElementTree(root: ParentNode, locale: 'en' | 'zh') {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node: Node | null = walker.nextNode()

  while (node) {
    const parent = node.parentElement
    const raw = node.textContent ?? ''
    if (
      parent &&
      !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName) &&
      !parent.isContentEditable
    ) {
      const translated = translateUiText(raw, locale)
      if (translated !== raw) {
        node.textContent = translated
      }
    }
    node = walker.nextNode()
  }

  const elements = root instanceof Element ? [root, ...root.querySelectorAll('*')] : Array.from(root.querySelectorAll('*'))
  for (const element of elements) {
    for (const attr of ['placeholder', 'title', 'aria-label']) {
      const value = element.getAttribute(attr)
      if (!value) continue
      const translated = translateUiText(value, locale)
      if (translated !== value) {
        element.setAttribute(attr, translated)
      }
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  const { locale } = useStudioLocale()

  const applyTranslations = () => {
    window.requestAnimationFrame(() => {
      translateElementTree(document.body, locale.value)
    })
  }

  let observer: MutationObserver | null = null

  nuxtApp.hook('app:mounted', () => {
    applyTranslations()

    observer = new MutationObserver(() => {
      applyTranslations()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label'],
    })
  })

  watch(locale, () => {
    applyTranslations()
  })

  const router = useRouter()
  router.afterEach(() => {
    applyTranslations()
  })

  nuxtApp.hook('app:beforeUnmount', () => {
    observer?.disconnect()
  })
})
