import type { ProviderProfileDetail } from '#shared/types/dashboard'

export default defineEventHandler((): ProviderProfileDetail => {
  return getProviderProfile()
})
