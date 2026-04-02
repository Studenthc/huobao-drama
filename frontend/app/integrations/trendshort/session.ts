export interface TrendShortStudioSessionPayload {
  return_url?: string
}

export async function fetchTrendShortStudioSession() {
  const response = await $fetch<{ data?: TrendShortStudioSessionPayload }>('/api/studio/session/me', {
    credentials: 'include',
  })

  return response?.data ?? null
}
