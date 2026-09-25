export default defineEventHandler((event) => {
  return callApi(event, '/dashboard/account/deactivate', { method: 'POST' })
})
