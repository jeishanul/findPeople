import type { PagedResult, ProviderProfile } from '#shared/types/marketplace'

export default defineEventHandler((event): PagedResult<ProviderProfile> => {
  const query = getQuery(event)

  return getProviders({
    category: typeof query.category === 'string' ? query.category : undefined,
    minRating: query.minRating ? Number(query.minRating) : undefined,
    verifiedOnly: query.verifiedOnly === 'true',
    minRate: query.minRate ? Number(query.minRate) : undefined,
    maxRate: query.maxRate ? Number(query.maxRate) : undefined,
    page: query.page ? Number(query.page) : undefined,
    perPage: query.perPage ? Number(query.perPage) : undefined,
  })
})
