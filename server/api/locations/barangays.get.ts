import type { Barangay } from '#server/utils/phLocations'

export default defineEventHandler((event): Barangay[] => {
  const query = getQuery(event)
  const cityCode = typeof query.city === 'string' ? query.city : ''
  if (!cityCode) return []
  return getBarangaysByCity(cityCode)
})
