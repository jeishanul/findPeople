import type { FetchOptions } from 'ofetch'

/**
 * One-off (non-reactive) calls to our own backend — form submits, uploads,
 * toggles — go through this instead of a bare `$fetch`. `security.csrf` is
 * on (see `nuxt.config.ts`), which rejects every POST/PUT/PATCH without a
 * matching `csrf-token` header; `nuxt-csurf`'s own `$csrfFetch` (from its
 * Nuxt plugin) attaches it automatically. Reactive/initial-load fetches
 * still go through `useApi` (see CLAUDE.md's Composables & utils rules).
 */
export function useApiFetch<T = unknown>(request: string, options?: FetchOptions<'json'>): Promise<T> {
  return useNuxtApp().$csrfFetch<T>(request, options)
}
