interface TwoFactorChallenge {
  twoFactorRequired: true
  challengeToken: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = await callApi<{ token: string, user: unknown } | TwoFactorChallenge>(event, '/auth/login', {
    method: 'POST',
    body,
    auth: false,
  })

  if ('twoFactorRequired' in result) return result

  setAuthToken(event, result.token)

  return result.user
})
