import type { ServiceListing } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<ServiceListing[]> => {
  return callApi<ServiceListing[]>(event, '/dashboard/services')
})
