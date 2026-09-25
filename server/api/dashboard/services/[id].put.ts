export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return callApi(event, `/dashboard/services/${id}`, { method: 'PUT', body })
})
