import type { EarningsSummary } from '#shared/types/dashboard'

export default defineEventHandler((): EarningsSummary => {
  return getEarningsSummary()
})
