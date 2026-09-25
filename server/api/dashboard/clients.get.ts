import type { ClientServed } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<ClientServed[]> => {
  return callApi<ClientServed[]>(event, '/dashboard/clients')
})
