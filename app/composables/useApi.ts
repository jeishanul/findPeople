/**
 * Centralized `useFetch` factory: every feature composable that talks to our
 * own API should build on this instead of calling `useFetch`/`$fetch` directly,
 * so base URL, auth headers and error handling stay in one place.
 */
export const useApi = createUseFetch({
  baseURL: '/api',
  onResponseError({ response }) {
    if (response.status === 401) {
      // The Nitro proxy layer (server/utils/apiProxy.ts) already cleared the
      // stale cookie server-side — mirror that locally so `isAuthenticated`
      // flips immediately, and prompt the person to log back in.
      useSession().clearLocal()
      useAuthModal().open('login')
    }
  },
})
