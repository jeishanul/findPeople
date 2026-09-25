import type { PurchaseRecord } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<PurchaseRecord[]> => {
  return callApi<PurchaseRecord[]>(event, '/dashboard/purchases')
})
