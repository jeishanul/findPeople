export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return callApi(event, '/auth/forgot-password', { method: 'POST', body, auth: false })
})
