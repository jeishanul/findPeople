import type { CityMunicipality } from '#server/utils/phLocations'

export default defineEventHandler((event): CityMunicipality[] => {
  const query = getQuery(event)
  const provinceCode = typeof query.province === 'string' ? query.province : ''
  if (!provinceCode) return []
  return getCitiesByProvince(provinceCode)
})
