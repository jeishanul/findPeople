export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readFormData(event)

  return callApi(event, `/dashboard/conversations/${id}/messages`, { method: 'POST', body })
})
