export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return callApi(event, '/auth/verify-otp', { method: 'POST', body, auth: false })
})
