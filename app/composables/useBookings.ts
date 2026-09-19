import type { ClientServed, Conversation, PurchaseRecord, Quote } from '#shared/types/dashboard'

/**
 * Session-only overlay of bookings created by accepting an in-chat quote —
 * `useState`-backed, ephemeral like the rest of this mock app's data (see
 * CLAUDE.md — no real backend, so this never survives a reload). Pages
 * (`purchases.vue`, `clients.vue`) concat their fetched list with this
 * overlay rather than mutating the fetched ref directly.
 */
export function useBookings() {
  const overlay = useState<{ purchases: PurchaseRecord[], clientsServed: ClientServed[] }>(
    'bookings-overlay',
    () => ({ purchases: [], clientsServed: [] }),
  )

  /** A quote in `conversation` was accepted: adds one "upcoming" entry to
   * whichever side of this single demo account the conversation represents —
   * `conversation.role === 'client'` means the account is the provider here
   * (personName is the client, so it gains a Clients Served entry);
   * `role === 'provider'` means the account is the consumer here (personName
   * is the provider, so it gains a Purchases entry). Only one list ever
   * grows per acceptance — a single mock account can't be both sides of the
   * same booking at once. */
  function acceptQuote(conversation: Conversation, quote: Quote) {
    const id = `booking-${quote.id}`
    const today = new Date().toISOString().slice(0, 10)

    if (conversation.role === 'client') {
      const clientServed: ClientServed = {
        id,
        clientName: conversation.personName,
        categoryId: conversation.categoryId,
        date: today,
        amountUsd: quote.basePriceUsd,
        status: 'upcoming',
        rating: null,
        repeatClient: false,
      }
      overlay.value = { ...overlay.value, clientsServed: [...overlay.value.clientsServed, clientServed] }
      return
    }

    const purchase: PurchaseRecord = {
      id,
      providerName: conversation.personName,
      categoryId: conversation.categoryId,
      date: today,
      status: 'upcoming',
    }
    overlay.value = { ...overlay.value, purchases: [...overlay.value.purchases, purchase] }
  }

  return {
    purchasesOverlay: computed(() => overlay.value.purchases),
    clientsServedOverlay: computed(() => overlay.value.clientsServed),
    acceptQuote,
  }
}
