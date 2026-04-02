<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-right" :duration="3000" />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import { useStudioLocale } from '~/composables/useStudioLocale'

const { locale } = useStudioLocale()

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' },
  ],
}))
</script>

<style>
@import url('./assets/studio.css');
</style>
