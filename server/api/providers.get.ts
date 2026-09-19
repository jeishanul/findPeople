import type { PagedResult, ProviderProfile } from '#shared/types/marketplace'

export default defineEventHandler((event): PagedResult<ProviderProfile> => {
  const query = getQuery(event)

  return getProviders({
    categories: typeof query.categories === 'string' && query.categories ? query.categories.split(',').filter(Boolean) : undefined,
    minRating: query.minRating ? Number(query.minRating) : undefined,
    verifiedOnly: query.verifiedOnly === 'true',
    minRate: query.minRate ? Number(query.minRate) : undefined,
    maxRate: query.maxRate ? Number(query.maxRate) : undefined,
    province: typeof query.province === 'string' ? query.province : undefined,
    city: typeof query.city === 'string' ? query.city : undefined,
    barangay: typeof query.barangay === 'string' ? query.barangay : undefined,
    page: query.page ? Number(query.page) : undefined,
    perPage: query.perPage ? Number(query.perPage) : undefined,
  })
})
