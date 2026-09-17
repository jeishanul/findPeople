import type { NotificationItem } from '#shared/types/dashboard'

export default defineEventHandler((): NotificationItem[] => {
  return getNotifications()
})
