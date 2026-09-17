import type { Conversation } from '#shared/types/dashboard'

export default defineEventHandler((): Conversation[] => {
  return getConversations()
})
