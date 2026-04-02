<template>
  <div class="handoff-shell">
    <div class="handoff-card">
      <p class="handoff-kicker">{{ t.brandName }}</p>
      <h1 class="handoff-title">{{ title }}</h1>
      <p class="handoff-desc">{{ description }}</p>
      <a v-if="fallbackUrl" :href="fallbackUrl" class="handoff-link">{{ t.backToTrendShort }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStudioLocale } from '~/composables/useStudioLocale'
import { fetchTrendShortStudioSession } from '~/integrations/trendshort/session'

definePageMeta({
  layout: false,
})

const route = useRoute()
const config = useRuntimeConfig()
const { t, syncLocale } = useStudioLocale()

const fallbackUrl = computed(() => {
  const value = route.query.return_url
  if (typeof value === 'string' && value.trim()) {
    return value
  }
  return config.public.trendshortAppUrl
})
const title = ref('')
const description = ref('')

function applyDefaultCopy() {
  title.value = t.value.handoffTitle
  description.value = t.value.handoffDescription
}

applyDefaultCopy()

onMounted(async () => {
  syncLocale(
    typeof route.query.locale === 'string' ? route.query.locale : null,
    typeof route.query.return_url === 'string' ? route.query.return_url : null,
    fallbackUrl.value,
  )
  applyDefaultCopy()

  const token = typeof route.query.token === 'string' ? route.query.token : ''
  const next = typeof route.query.next === 'string' ? route.query.next : null

  if (!token) {
    title.value = t.value.handoffMissingTitle
    description.value = t.value.handoffMissingDescription
    return
  }

  try {
    const response = await $fetch<{ data?: { redirect_to?: string } }>('/api/studio/sso/exchange', {
      method: 'POST',
      credentials: 'include',
      body: {
        token,
        next,
      },
    })

    const redirectTo = response?.data?.redirect_to || '/'
    const session = await fetchTrendShortStudioSession().catch(() => null)
    syncLocale(session?.return_url || fallbackUrl.value)
    await navigateTo(redirectTo, { replace: true })
  } catch (error) {
    title.value = t.value.handoffErrorTitle
    description.value = error instanceof Error
      ? error.message
      : t.value.handoffErrorDescription
  }
})
</script>

<style scoped>
.handoff-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background:
    radial-gradient(circle at top, rgba(76, 125, 255, 0.18), transparent 34%),
    linear-gradient(180deg, #080b14 0%, #05070d 100%);
}

.handoff-card {
  width: min(520px, 100%);
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 11, 20, 0.9);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
}

.handoff-kicker {
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.handoff-title {
  margin: 0;
  color: #fff;
  font-size: 28px;
  line-height: 1.05;
}

.handoff-desc {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  line-height: 1.6;
}

.handoff-link {
  display: inline-flex;
  margin-top: 20px;
  color: #9db3ff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
</style>
