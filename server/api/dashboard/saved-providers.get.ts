import type { SavedProvider } from '#shared/types/dashboard'

export default defineEventHandler((): SavedProvider[] => {
  return getSavedProviders()
})
