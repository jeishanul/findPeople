import type { UserRole } from '#shared/types/dashboard'

interface SessionState {
  isAuthenticated: boolean
  name: string
  initials: string
}

/**
 * Mock, client-side-only session — there's no auth backend yet (see
 * `MarketplaceAuthModal` and CLAUDE.md), so "logging in" just marks this
 * demo account authenticated. `useState` keeps it request-isolated under SSR
 * (never a module-level ref — see CLAUDE.md) and is the same pattern
 * `useAuthModal` uses for cross-component state.
 *
 * `activeRole` (the Provider/Consumer switch on the dashboard) is tracked
 * separately via `useLocalStorage`, not `useState` — it's a durable UI
 * preference, not login state, so unlike the rest of this mock session it's
 * expected to survive a reload. It only changes which widgets/nav items are
 * emphasized, never which routes are reachable while authenticated. Defaults
 * to 'consumer' since most people who sign up are consumers, not providers.
 */
export function useSession() {
  const state = useState<SessionState>('session', () => ({
    isAuthenticated: false,
    name: '',
    initials: '',
  }))

  const activeRole = useLocalStorage<UserRole>('findpeople-active-role', 'consumer')

  function login(name: string) {
    state.value = {
      ...state.value,
      isAuthenticated: true,
      name,
      initials: initialsFor(name),
    }
  }

  function logout() {
    state.value = { ...state.value, isAuthenticated: false }
  }

  function setActiveRole(role: UserRole) {
    activeRole.value = role
  }

  return {
    isAuthenticated: computed(() => state.value.isAuthenticated),
    name: computed(() => state.value.name),
    initials: computed(() => state.value.initials),
    activeRole,
    login,
    logout,
    setActiveRole,
  }
}
