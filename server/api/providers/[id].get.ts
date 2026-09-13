import type { ProviderProfile } from '#shared/types/marketplace'

export default defineEventHandler((event): ProviderProfile => {
  const id = getRouterParam(event, 'id')
  const provider = id ? getProviderById(id) : undefined

  if (!provider) {
    throw createError({ statusCode: 404, statusMessage: 'Provider not found' })
  }

  return provider
})
