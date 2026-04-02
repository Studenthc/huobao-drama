<template>
  <div class="lang-switcher" :class="{ compact }">
    <button
      type="button"
      class="lang-button"
      :class="{ active: locale === 'en' }"
      @click="setLocale('en')"
    >
      {{ t.languageEnglish }}
    </button>
    <button
      type="button"
      class="lang-button"
      :class="{ active: locale === 'zh' }"
      @click="setLocale('zh')"
    >
      {{ t.languageChinese }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useStudioLocale } from '~/composables/useStudioLocale'

defineProps<{
  compact?: boolean
}>()

const { locale, setLocale, t } = useStudioLocale()
</script>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-2);
}

.lang-switcher.compact {
  padding: 3px;
}

.lang-button {
  border: none;
  background: transparent;
  color: var(--text-2);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.03em;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.18s var(--ease-out);
}

.lang-switcher.compact .lang-button {
  padding: 5px 8px;
}

.lang-button:hover {
  color: var(--text-0);
}

.lang-button.active {
  background: var(--accent-bg);
  color: var(--accent-text);
}
</style>
