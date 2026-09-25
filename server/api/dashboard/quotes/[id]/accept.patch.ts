export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return callApi(event, `/dashboard/quotes/${id}/accept`, { method: 'PATCH' })
})
