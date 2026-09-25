export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { token, user } = await callApi<{ token: string, user: unknown }>(event, '/auth/register', {
    method: 'POST',
    body,
    auth: false,
  })

  setAuthToken(event, token)

  return user
})
