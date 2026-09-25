import type { NotificationItem } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<NotificationItem[]> => {
  return callApi<NotificationItem[]>(event, '/dashboard/notifications')
})
