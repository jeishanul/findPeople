import type { PurchaseRecord } from '#shared/types/dashboard'

export default defineEventHandler((): PurchaseRecord[] => {
  return getPurchases()
})
