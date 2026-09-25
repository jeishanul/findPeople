export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return callApi(event, '/auth/reset-password', { method: 'POST', body, auth: false })
})
