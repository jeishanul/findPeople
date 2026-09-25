/**
 * Guards every logged-in panel page (applied via `definePageMeta({
 * middleware: 'auth' })` on each one — `/dashboard`, `/profile`, etc.). Real
 * session now: hydrates once from `/api/auth/me` (via `useSession`) if it
 * hasn't already this request, then redirects home and opens the login modal
 * if that comes back unauthenticated.
 */
export default defineNuxtRouteMiddleware(async () => {
  const session = useSession()

  if (session.status.value === 'idle') {
    await session.fetchUser()
  }

  if (session.isAuthenticated.value) return

  const authModal = useAuthModal()
  authModal.open('login')

  const localePath = useLocalePath()
  return navigateTo(localePath('/'))
})
