export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return callApi(event, '/dashboard/profile', { method: 'PUT', body })
})
