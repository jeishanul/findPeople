/**
 * Shared "is this provider saved" state for the heart/save toggle wherever a
 * provider appears (browse results, provider profile) — backed by the real
 * `/dashboard/saved-providers` endpoints. `useState` so every card on a page
 * agrees after one toggle, without each card fetching the list itself.
 */
export function useSavedProviders() {
  const savedIds = useState<string[]>('saved-provider-ids', () => [])
  const loaded = useState<boolean>('saved-provider-ids-loaded', () => false)
  const session = useSession()

  async function ensureLoaded() {
    if (loaded.value || !session.isAuthenticated.value) return
    // `useRequestFetch()`, not `$fetch`/`useApiFetch` — this can run during
    // SSR (called with a top-level `await` from page setup), where a bare
    // `$fetch` to our own `/api/*` route doesn't forward the incoming
    // request's cookies (see `useSession.fetchUser`'s comment for the full
    // explanation) and `useApiFetch`'s CSRF wrapper crashes outside a
    // synchronous setup call. It's also a GET, so CSRF isn't needed anyway.
    const saved = await useRequestFetch()<{ id: string }[]>('/api/dashboard/saved-providers')
    savedIds.value = saved.map(provider => provider.id)
    loaded.value = true
  }

  function isSaved(providerId: string): boolean {
    return savedIds.value.includes(providerId)
  }

  async function toggle(providerId: string) {
    if (isSaved(providerId)) {
      await useApiFetch(`/api/dashboard/saved-providers/${providerId}`, { method: 'DELETE' })
      savedIds.value = savedIds.value.filter(id => id !== providerId)
    }
    else {
      await useApiFetch(`/api/dashboard/saved-providers/${providerId}`, { method: 'POST' })
      savedIds.value = [...savedIds.value, providerId]
    }
  }

  return { ensureLoaded, isSaved, toggle }
}
