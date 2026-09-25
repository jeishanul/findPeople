import type { AccountSettings } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<AccountSettings> => {
  return callApi<AccountSettings>(event, '/dashboard/account')
})
