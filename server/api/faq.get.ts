import type { FaqItem } from '#shared/types/marketplace'

export default defineEventHandler((event): Promise<FaqItem[]> => {
  return callApi<FaqItem[]>(event, '/faqs')
})
