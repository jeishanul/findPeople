export default defineEventHandler(async (event) => {
  const body = await readFormData(event)

  return callApi(event, '/dashboard/profile/avatar', { method: 'POST', body })
})
