import type { ProviderProfile } from '#shared/types/marketplace'

export default defineEventHandler((event): Promise<ProviderProfile> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 404, statusMessage: 'Provider not found' })
  }

  return callApi<ProviderProfile>(event, `/providers/${id}`)
})
