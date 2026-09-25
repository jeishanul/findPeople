import type { PagedResult, ProviderProfile } from '#shared/types/marketplace'

export default defineEventHandler((event): Promise<PagedResult<ProviderProfile>> => {
  const query = getQuery(event)

  return callApi<PagedResult<ProviderProfile>>(event, '/providers', {
    query: {
      categories: typeof query.categories === 'string' && query.categories ? query.categories : undefined,
      minRating: query.minRating,
      verifiedOnly: query.verifiedOnly,
      minRate: query.minRate,
      maxRate: query.maxRate,
      province: query.province,
      city: query.city,
      barangay: query.barangay,
      page: query.page,
      perPage: query.perPage,
    },
  })
})
