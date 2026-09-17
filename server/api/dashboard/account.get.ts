import type { AccountSettings } from '#shared/types/dashboard'

export default defineEventHandler((): AccountSettings => {
  return getAccountSettings()
})
