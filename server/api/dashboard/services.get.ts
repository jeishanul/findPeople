import type { ServiceListing } from '#shared/types/dashboard'

export default defineEventHandler((): ServiceListing[] => {
  return getServiceListings()
})
