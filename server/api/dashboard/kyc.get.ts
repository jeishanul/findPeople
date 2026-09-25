export default defineEventHandler((event) => {
  return callApi(event, '/dashboard/kyc')
})
