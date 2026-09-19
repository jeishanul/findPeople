import { slugify } from '#shared/utils/slugify'
import type { Conversation } from '#shared/types/dashboard'

/**
 * Session-only conversations created client-side this visit — e.g. when a
 * consumer clicks "Request a quote" on a provider with no existing thread
 * yet, or "Message" from Purchases/Clients Served for a counterpart with no
 * seeded conversation. `useState`-backed, ephemeral like the rest of this
 * mock app's data (see CLAUDE.md — no real backend to persist to).
 */
export function useConversations() {
  const localConversations = useState<Conversation[]>('local-conversations', () => [])

  function createConversation(input: { id: string, personName: string, categoryId: string, role: Conversation['role'], providerId?: string }): Conversation {
    const conversation: Conversation = {
      id: input.id,
      personName: input.personName,
      role: input.role,
      categoryId: input.categoryId,
      lastMessagePreview: '',
      timeAgoHours: 0,
      unread: false,
      online: false,
      lastSeenLabel: '',
      messages: [],
      providerId: input.providerId,
    }
    localConversations.value = [...localConversations.value, conversation]
    return conversation
  }

  /** Finds-or-creates a conversation tied to a real marketplace provider id
   * (e.g. from "Request a quote" on a provider's public profile) — reusing
   * an existing thread with that provider rather than duplicating one. */
  function ensureConversationForProvider(providerId: string, personName: string, categoryId: string, existing: Conversation[]): string {
    const found = [...existing, ...localConversations.value].find(c => c.providerId === providerId)
    if (found) return found.id
    return createConversation({ id: `local-${providerId}`, personName, categoryId, role: 'provider', providerId }).id
  }

  /** Finds-or-creates a conversation by counterpart name (e.g. from a
   * Purchases/Clients Served row's "Message" action) — this mock app's
   * dashboard-side people (purchases, clients served) aren't linked to the
   * separate marketplace provider dataset by id, only by matching name. */
  function ensureConversationForCounterpart(personName: string, categoryId: string, role: Conversation['role'], existing: Conversation[]): string {
    const needle = personName.trim().toLowerCase()
    const found = [...existing, ...localConversations.value].find(c => c.personName.trim().toLowerCase() === needle)
    if (found) return found.id
    return createConversation({ id: `local-${slugify(personName)}`, personName, categoryId, role }).id
  }

  return {
    localConversations,
    ensureConversationForProvider,
    ensureConversationForCounterpart,
  }
}
