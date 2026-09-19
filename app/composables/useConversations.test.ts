import { describe, expect, it } from 'vitest'
import type { Conversation } from '#shared/types/dashboard'
import { useConversations } from './useConversations'

describe('useConversations', () => {
  it('reuses an existing conversation matched by providerId', () => {
    const { ensureConversationForProvider, localConversations } = useConversations()
    const existing: Conversation[] = [{
      id: 'seeded',
      personName: 'Rahim Karim',
      role: 'provider',
      categoryId: 'electrician',
      lastMessagePreview: '',
      timeAgoHours: 0,
      unread: false,
      online: false,
      lastSeenLabel: '',
      messages: [],
      providerId: 'rahim-karim',
    }]

    const id = ensureConversationForProvider('rahim-karim', 'Rahim Karim', 'electrician', existing)

    expect(id).toBe('seeded')
    expect(localConversations.value).toHaveLength(0)
  })

  it('creates a new conversation when no match exists for the provider id', () => {
    const { ensureConversationForProvider, localConversations } = useConversations()

    const id = ensureConversationForProvider('anika-sultana', 'Anika Sultana', 'cleaning', [])

    expect(id).toBe('local-anika-sultana')
    expect(localConversations.value.some(c => c.id === id)).toBe(true)
  })

  it('is idempotent — a second call for the same provider reuses the created conversation', () => {
    const { ensureConversationForProvider, localConversations } = useConversations()

    ensureConversationForProvider('farhan-ahmed', 'Farhan Ahmed', 'plumber', [])
    ensureConversationForProvider('farhan-ahmed', 'Farhan Ahmed', 'plumber', [])

    expect(localConversations.value.filter(c => c.providerId === 'farhan-ahmed')).toHaveLength(1)
  })

  it('matches a counterpart by name for Purchases/Clients Served rows with no providerId', () => {
    const { ensureConversationForCounterpart } = useConversations()
    const existing: Conversation[] = [{
      id: 'marcus',
      personName: 'Marcus Tan',
      role: 'provider',
      categoryId: 'plumber',
      lastMessagePreview: '',
      timeAgoHours: 0,
      unread: false,
      online: false,
      lastSeenLabel: '',
      messages: [],
    }]

    const id = ensureConversationForCounterpart('Marcus Tan', 'plumber', 'provider', existing)

    expect(id).toBe('marcus')
  })
})
