import type { ServiceCategory } from '#shared/types/marketplace'

export default defineEventHandler((event): Promise<ServiceCategory[]> => {
  return callApi<ServiceCategory[]>(event, '/categories')
})
