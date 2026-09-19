import type { Province } from '#server/utils/phLocations'

export default defineEventHandler((): Province[] => {
  return getProvinces()
})
