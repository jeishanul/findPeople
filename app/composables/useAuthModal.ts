export type AuthModalView = 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password' | 'two-factor'

interface AuthModalState {
  isOpen: boolean
  view: AuthModalView
  /**
   * Carried across the forgot-password → otp → reset-password steps so each
   * step can display/reuse it (e.g. "Change email" going back a step) without
   * re-asking or the caller having to thread it through manually.
   */
  resetEmail: string
}

/**
 * Cross-component auth modal state — any "Log in" / "Sign up" / "Message"
 * control anywhere in the app opens the same modal (mounted once in
 * `layouts/default.vue`) on the requested view. `useState` keeps it
 * request-isolated under SSR (see CLAUDE.md — never a module-level ref here).
 */
export function useAuthModal() {
  const state = useState<AuthModalState>('auth-modal', () => ({
    isOpen: false,
    view: 'login',
    resetEmail: '',
  }))

  function open(view: AuthModalView = 'login') {
    state.value = { ...state.value, isOpen: true, view }
  }

  function close() {
    state.value = { ...state.value, isOpen: false }
  }

  function setView(view: AuthModalView) {
    state.value = { ...state.value, view }
  }

  function setResetEmail(email: string) {
    state.value = { ...state.value, resetEmail: email }
  }

  return {
    isOpen: computed(() => state.value.isOpen),
    view: computed(() => state.value.view),
    resetEmail: computed(() => state.value.resetEmail),
    open,
    close,
    setView,
    setResetEmail,
  }
}
