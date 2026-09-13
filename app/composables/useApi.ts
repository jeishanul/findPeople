/**
 * Centralized `useFetch` factory: every feature composable that talks to our
 * own API should build on this instead of calling `useFetch`/`$fetch` directly,
 * so base URL, auth headers and error handling stay in one place.
 */
export const useApi = createUseFetch({
  baseURL: '/api',
  onResponseError({ response }) {
    if (response.status === 401) {
      // Add an auth flow (e.g. redirect to a login page) once one exists.
      console.error('Unauthorized API request')
    }
  },
})
