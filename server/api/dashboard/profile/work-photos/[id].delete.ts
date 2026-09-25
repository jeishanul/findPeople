export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return callApi(event, `/dashboard/profile/work-photos/${id}`, { method: 'DELETE' })
})
