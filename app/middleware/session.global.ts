/**
 * Runs on every route (the `.global.ts` suffix, not just pages with
 * `middleware: 'auth'`) — hydrates the session from `/api/auth/me` once per
 * request/app-load so a logged-in person shows as logged in everywhere
 * (header, "Save"/"Message" affordances on public pages), not just inside
 * the dashboard. `auth.ts` still does its own redirect-if-unauthenticated
 * check for dashboard routes; this only does the hydration part, which was
 * previously only reachable through that middleware, so any public page a
 * logged-in person opened first (a shared provider link, a fresh tab on the
 * homepage) rendered the header as if they were signed out.
 */
export default defineNuxtRouteMiddleware(async () => {
  const session = useSession()

  if (session.status.value === 'idle') {
    await session.fetchUser()
  }
})
