export default defineEventHandler(async (event) => {
  const step = getRouterParam(event, 'step')
  const body = await readFormData(event)

  return callApi(event, `/dashboard/kyc/${step}`, { method: 'POST', body })
})
