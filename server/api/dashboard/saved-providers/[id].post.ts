export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return callApi(event, `/dashboard/saved-providers/${id}`, { method: 'POST' })
})
