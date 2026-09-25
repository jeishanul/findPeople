export default defineEventHandler(async (event) => {
  // Best-effort: still clear the local cookie even if the token was already
  // invalid server-side (e.g. it expired between page load and this click).
  await callApi(event, '/auth/logout', { method: 'POST' }).catch(() => null)

  clearAuthToken(event)

  return { message: 'Logged out.' }
})
