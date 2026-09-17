import type { Transaction } from '#shared/types/dashboard'

export default defineEventHandler((): Transaction[] => {
  return getTransactions()
})
