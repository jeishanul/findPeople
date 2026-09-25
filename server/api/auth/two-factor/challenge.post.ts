export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { token, user } = await callApi<{ token: string, user: unknown }>(event, '/auth/two-factor/challenge', {
    method: 'POST',
    body,
    auth: false,
  })

  setAuthToken(event, token)

  return user
})
