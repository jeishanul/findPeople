import type { UserRole } from '#shared/types/dashboard'

interface SessionState {
  isAuthenticated: boolean
  name: string
  initials: string
  activeRole: UserRole
}

/**
 * Mock, client-side-only session — there's no auth backend yet (see
 * `MarketplaceAuthModal` and CLAUDE.md), so "logging in" just marks this
 * demo account authenticated. `useState` keeps it request-isolated under SSR
 * (never a module-level ref — see CLAUDE.md) and is the same pattern
 * `useAuthModal` uses for cross-component state. `activeRole` is the
 * Provider/Consumer switch on the dashboard: it only changes which widgets
 * are emphasized, never which routes are reachable — every account can
 * always browse and purchase services, regardless of the active role.
 */
export function useSession() {
  const state = useState<SessionState>('session', () => ({
    isAuthenticated: false,
    name: '',
    initials: '',
    activeRole: 'provider',
  }))

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
    state.value = { ...state.value, activeRole: role }
  }

  return {
    isAuthenticated: computed(() => state.value.isAuthenticated),
    name: computed(() => state.value.name),
    initials: computed(() => state.value.initials),
    activeRole: computed(() => state.value.activeRole),
    login,
    logout,
    setActiveRole,
  }
}
