import type { ServiceCategory } from '#shared/types/marketplace'

export default defineEventHandler((): ServiceCategory[] => {
  return getCategories()
})
