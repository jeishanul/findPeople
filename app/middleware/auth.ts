/**
 * Guards every logged-in panel page (applied via
 * `definePageMeta({ middleware: 'auth' })` on each one — `/dashboard`,
 * `/profile`, `/messages`, etc.). There's no real auth backend yet (see
 * `useSession`), so this just checks the mock session and, if it's missing,
 * opens the same login modal every other "Log in" control uses before
 * redirecting home.
 */
export default defineNuxtRouteMiddleware(() => {
  const session = useSession()
  if (session.isAuthenticated.value) return

  const authModal = useAuthModal()
  authModal.open('login')

  const localePath = useLocalePath()
  return navigateTo(localePath('/'))
})
