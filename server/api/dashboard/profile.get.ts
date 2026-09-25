import type { ProviderProfileDetail } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<ProviderProfileDetail> => {
  return callApi<ProviderProfileDetail>(event, '/dashboard/profile')
})
