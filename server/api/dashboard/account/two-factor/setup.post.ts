export default defineEventHandler((event) => {
  return callApi(event, '/dashboard/account/two-factor/setup', { method: 'POST' })
})
