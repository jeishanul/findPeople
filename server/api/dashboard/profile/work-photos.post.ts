export default defineEventHandler(async (event) => {
  const body = await readFormData(event)

  return callApi(event, '/dashboard/profile/work-photos', { method: 'POST', body })
})
