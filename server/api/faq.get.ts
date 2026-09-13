import type { FaqItem } from '#shared/types/marketplace'

export default defineEventHandler((): FaqItem[] => {
  return getFaqItems()
})
