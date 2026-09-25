import type { SavedProvider } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<SavedProvider[]> => {
  return callApi<SavedProvider[]>(event, '/dashboard/saved-providers')
})
