/**
 * Used to hydrate `useSession` on every load — returns `null` for "not
 * logged in" instead of a 401, since that's an expected, common state here
 * (unlike every other authenticated route, where a 401 really is an error).
 */
export default defineEventHandler(async (event) => {
  if (!getAuthToken(event)) {
    return null
  }

  try {
    return await callApi(event, '/auth/me')
  }
  catch {
    // Stale/expired/revoked token — clear it so future requests don't retry.
    clearAuthToken(event)
    return null
  }
})
