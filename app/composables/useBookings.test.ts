import { describe, expect, it } from 'vitest'
import type { Conversation, Quote } from '#shared/types/dashboard'
import { useBookings } from './useBookings'

function makeConversation(role: Conversation['role'], personName: string): Conversation {
  return {
    id: 'c1',
    personName,
    role,
    categoryId: 'ac-service',
    lastMessagePreview: '',
    timeAgoHours: 0,
    unread: false,
    online: false,
    lastSeenLabel: '',
    messages: [],
  }
}

function makeQuote(id: string): Quote {
  return { id, basePriceUsd: 50, baseHours: 3, extraHourlyRateUsd: 10, status: 'accepted' }
}

// `useBookings`' overlay is `useState`-backed and shared across every call in
// this file (not reset between tests, matching the real app's session-wide
// singleton), so each test uses its own unique name/quote id and asserts by
// finding its own entry rather than the overlay's total length.
describe('useBookings', () => {
  it('adds a Clients Served entry when the conversation counterpart is a client', () => {
    const { acceptQuote, clientsServedOverlay, purchasesOverlay } = useBookings()

    acceptQuote(makeConversation('client', 'Jae Lin'), makeQuote('q-client-1'))

    expect(clientsServedOverlay.value).toContainEqual(expect.objectContaining({ clientName: 'Jae Lin', amountUsd: 50, status: 'upcoming' }))
    expect(purchasesOverlay.value.find(p => p.id === 'booking-q-client-1')).toBeUndefined()
  })

  it('adds a Purchases entry when the conversation counterpart is a provider', () => {
    const { acceptQuote, purchasesOverlay, clientsServedOverlay } = useBookings()

    acceptQuote(makeConversation('provider', 'Nadia Brooks'), makeQuote('q-provider-1'))

    expect(purchasesOverlay.value).toContainEqual(expect.objectContaining({ providerName: 'Nadia Brooks', status: 'upcoming' }))
    expect(clientsServedOverlay.value.find(c => c.id === 'booking-q-provider-1')).toBeUndefined()
  })
})
