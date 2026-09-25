import type { AuthUser, TwoFactorChallenge } from '#shared/types/auth'
import type { UserRole } from '#shared/types/dashboard'

interface SessionState {
  user: AuthUser | null
  /** `idle` until the first `fetchUser()` resolves — lets the auth
   * middleware know whether it still needs to check, vs. already knows. */
  status: 'idle' | 'loading' | 'ready'
}

/**
 * Real, server-backed session — replaces the old mock/client-only version.
 * `useState` keeps it request-isolated under SSR (never a module-level ref —
 * see CLAUDE.md). The actual Sanctum token never reaches this composable (or
 * any client code): it lives in an httpOnly cookie the Nitro proxy layer
 * manages — see `server/utils/apiProxy.ts`.
 *
 * Login/register/logout/me are imperative, one-off actions, not the
 * reactive GET data-binding `useApi` (Nuxt's `useFetch` under the hood) is
 * built for — they use `useApiFetch` instead (a thin `$fetch` wrapper that
 * attaches the CSRF header `security.csrf` now requires on every
 * POST/PUT/PATCH — see `useApiFetch.ts`), per CLAUDE.md's "own backend"
 * framing: that rule centralizes *data-fetching*, not one-shot mutations,
 * which this composable already centralizes on its own.
 *
 * `activeRole` (the Provider/Consumer switch on the dashboard) is tracked
 * separately via `useLocalStorage`, not `useState` — it's a durable UI
 * preference, not login state, so unlike the rest of this session it's
 * expected to survive a reload. It only changes which widgets/nav items are
 * emphasized, never which routes are reachable while authenticated. Defaults
 * to 'consumer' since most people who sign up are consumers, not providers.
 */
export function useSession() {
  const state = useState<SessionState>('session', () => ({
    user: null,
    status: 'idle',
  }))

  const activeRole = useLocalStorage<UserRole>('findpeople-active-role', 'consumer')

  async function fetchUser() {
    state.value = { ...state.value, status: 'loading' }
    // `useRequestFetch()`, not `$fetch` or `useApiFetch` — this runs from the
    // global session middleware during SSR, where a bare `$fetch` call to our
    // own `/api/*` route does NOT forward the incoming request's cookies (a
    // real bug this was: every public-page SSR render saw a logged-out
    // session even with a valid `fp_token` cookie, because the internal
    // `/api/auth/me` call arrived cookie-less). `useRequestFetch()` is Nuxt's
    // fetcher specifically for this — forwards the original request's
    // headers/cookies server-side, and behaves like plain `$fetch`
    // client-side. Also skips `useApiFetch`'s CSRF wrapper: this is a GET,
    // never CSRF-checked server-side, and that wrapper crashes when called
    // from middleware during SSR. A "not logged in" response has an empty
    // body (H3 sends `null` as a bodyless 204), which ofetch resolves to
    // `undefined` rather than `null` — normalize so `isAuthenticated`
    // (`!== null`) is never fooled by that into treating "no user" as
    // "someone's logged in".
    const user = (await useRequestFetch()<AuthUser | null>('/api/auth/me')) ?? null
    state.value = { user, status: 'ready' }
    return user
  }

  /** Returns a `TwoFactorChallenge` instead of the user when 2FA is enabled — the caller must follow up with `completeTwoFactorChallenge`. */
  async function login(identifier: string, password: string) {
    const result = await useApiFetch<AuthUser | TwoFactorChallenge>('/api/auth/login', {
      method: 'POST',
      body: { identifier, password },
    })
    if ('twoFactorRequired' in result) return result
    state.value = { user: result, status: 'ready' }
    return result
  }

  async function completeTwoFactorChallenge(challengeToken: string, code: string) {
    const user = await useApiFetch<AuthUser>('/api/auth/two-factor/challenge', {
      method: 'POST',
      body: { challengeToken, code },
    })
    state.value = { user, status: 'ready' }
    return user
  }

  async function register(fullName: string, email: string, password: string) {
    const user = await useApiFetch<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: { fullName, email, password },
    })
    state.value = { user, status: 'ready' }
    return user
  }

  async function logout() {
    await useApiFetch('/api/auth/logout', { method: 'POST' })
    state.value = { user: null, status: 'ready' }
  }

  /** Clears local state only — for when the server has already told us the
   * session is gone (a 401 from `useApi`, see its `onResponseError`) and
   * there's nothing left to invalidate server-side. */
  function clearLocal() {
    state.value = { user: null, status: 'ready' }
  }

  function setActiveRole(role: UserRole) {
    activeRole.value = role
  }

  return {
    user: computed(() => state.value.user),
    isAuthenticated: computed(() => state.value.user !== null),
    name: computed(() => state.value.user?.name ?? ''),
    initials: computed(() => (state.value.user ? initialsFor(state.value.user.name) : '')),
    status: computed(() => state.value.status),
    activeRole,
    fetchUser,
    login,
    completeTwoFactorChallenge,
    register,
    logout,
    clearLocal,
    setActiveRole,
  }
}
