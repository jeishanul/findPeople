import type { Conversation } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<Conversation[]> => {
  return callApi<Conversation[]>(event, '/dashboard/conversations')
})
