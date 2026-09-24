<script setup lang="ts">
import type { Conversation, ConversationMessage, MessageAttachment, Quote } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()
const route = useRoute()

const { data: fetchedConversations } = await useApi<Conversation[]>('/dashboard/conversations', {
  key: 'dashboard-conversations',
  default: () => [],
})

const { localConversations } = useConversations()
const { acceptQuote } = useBookings()

// Fetched seed conversations plus any created client-side this session (e.g.
// via "Request a quote" on a provider profile, or "Message" from a
// Purchases/Clients Served row with no seeded thread) — see `useConversations`.
const conversations = computed(() => [...(fetchedConversations.value ?? []), ...localConversations.value])

const search = ref('')
const activeId = ref('')

// Swipe-to-archive on the list (see `UiSwipeAction`) — local-only, like
// every other mutation on this mock/no-backend page (see `handleSend`
// below): archiving just hides the row from `filteredConversations`.
const archivedIds = ref<string[]>([])

function archiveConversation(id: string) {
  archivedIds.value = [...archivedIds.value, id]
  if (activeId.value === id) {
    activeId.value = ''
    mobileThreadOpen.value = false
  }
}

// Master-detail collapses to one pane on mobile (native chat-app pattern —
// see CLAUDE.md): the list and thread never show side by side below `md`,
// so a real tap (or an incoming `?conversation=`) is what reveals the
// thread, not the list's default auto-select of `list[0]` below. While the
// thread pane is showing on mobile, `<AppBottomNav>` steps aside too — its
// own fixed composer would otherwise stack on top of the tab bar (see
// `useBottomNav`) — and `onUnmounted` guarantees that gets reset even if
// the user navigates away mid-thread.
const mobileThreadOpen = ref(false)
const bottomNav = useBottomNav()

watch(mobileThreadOpen, (open) => {
  if (open) bottomNav.hide()
  else bottomNav.show()
})
onUnmounted(() => bottomNav.show())

// Local, mutable copy of each thread's messages — there's no send/delete
// backend yet (see `MarketplaceAuthModal` for the same "UI-only" pattern),
// so sending/deleting only ever changes this in-memory state, seeded once
// from the fetched conversations.
const messagesByConversation = ref<Record<string, ConversationMessage[]>>({})

watch(conversations, (list) => {
  for (const conversation of list) {
    if (!messagesByConversation.value[conversation.id]) {
      messagesByConversation.value[conversation.id] = [...conversation.messages]
    }
  }
  if (!activeId.value) {
    const requested = typeof route.query.conversation === 'string' ? route.query.conversation : undefined
    const match = requested ? list.find(c => c.id === requested) : undefined
    activeId.value = match?.id ?? list[0]?.id ?? ''
    // Arriving with an explicit `?conversation=` is intent to view that
    // thread; the plain `list[0]` fallback above is not — it stays on the
    // list on mobile until the person actually taps a conversation.
    if (match) mobileThreadOpen.value = true
  }
}, { immediate: true })

// A table row's "Message" action navigates to `?conversation=<id>` on this
// same page (Nuxt reuses the component instance rather than remounting it),
// so react to in-place query changes too, not just the initial load.
watch(() => route.query.conversation, (value) => {
  const requested = typeof value === 'string' ? value : undefined
  if (requested && conversations.value.some(c => c.id === requested)) {
    activeId.value = requested
    mobileThreadOpen.value = true
  }
})

function selectConversation(id: string) {
  activeId.value = id
  mobileThreadOpen.value = true
}

const filteredConversations = computed(() => {
  const query = search.value.trim().toLowerCase()
  return conversations.value
    .filter(conversation => !archivedIds.value.includes(conversation.id))
    .filter(conversation => !query || conversation.personName.toLowerCase().includes(query))
})

const activeConversation = computed(() =>
  conversations.value.find(conversation => conversation.id === activeId.value) ?? conversations.value[0],
)

const activeMessages = computed(() => messagesByConversation.value[activeId.value] ?? [])

function setMessageStatus(conversationId: string, messageId: string, status: ConversationMessage['status']) {
  const list = messagesByConversation.value[conversationId]
  if (!list) return
  messagesByConversation.value = {
    ...messagesByConversation.value,
    [conversationId]: list.map(message => (message.id === messageId ? { ...message, status } : message)),
  }
}

function appendMessage(conversationId: string, message: ConversationMessage) {
  messagesByConversation.value = {
    ...messagesByConversation.value,
    [conversationId]: [...(messagesByConversation.value[conversationId] ?? []), message],
  }
}

function handleSend({ text, attachment }: { text: string, attachment?: MessageAttachment }) {
  const conversationId = activeId.value
  const messageId = `local-${Date.now()}`
  appendMessage(conversationId, { id: messageId, fromMe: true, text, attachment, status: 'sent' })

  // Simulate the delivered → seen lifecycle client-side, the same way the
  // rest of this app fakes anything that would need a real backend.
  setTimeout(() => setMessageStatus(conversationId, messageId, 'delivered'), 900)
  setTimeout(() => setMessageStatus(conversationId, messageId, 'seen'), 2400)
}

function handleDelete(messageId: string) {
  const conversationId = activeId.value
  const list = messagesByConversation.value[conversationId]
  if (!list) return
  messagesByConversation.value = {
    ...messagesByConversation.value,
    [conversationId]: list.filter(message => message.id !== messageId),
  }
}

function handleSendQuote(payload: { basePriceUsd: number, baseHours: number, extraHourlyRateUsd: number, note: string }) {
  const conversationId = activeId.value
  const quote: Quote = { id: `quote-${Date.now()}`, ...payload, status: 'pending' }
  appendMessage(conversationId, { id: `local-${Date.now()}`, fromMe: true, text: '', status: 'sent', quote })
}

function setQuoteStatus(messageId: string, status: Quote['status']) {
  const conversationId = activeId.value
  const list = messagesByConversation.value[conversationId]
  const message = list?.find(m => m.id === messageId)
  if (!message?.quote) return
  messagesByConversation.value = {
    ...messagesByConversation.value,
    [conversationId]: list!.map(m => (m.id === messageId ? { ...m, quote: { ...m.quote!, status } } : m)),
  }
  return message.quote
}

function handleAcceptQuote(messageId: string) {
  const quote = setQuoteStatus(messageId, 'accepted')
  if (quote && activeConversation.value) acceptQuote(activeConversation.value, { ...quote, status: 'accepted' })
}

function handleDeclineQuote(messageId: string) {
  setQuoteStatus(messageId, 'declined')
}

useSeoMeta({
  title: t('dashboard.messages.title'),
})
</script>

<template>
  <div class="flex h-[calc(100vh-160px)] min-h-[560px] flex-col gap-5">
    <div :class="mobileThreadOpen ? 'hidden md:block' : 'block'">
      <h1 class="font-display text-2xl font-bold">
        {{ t('dashboard.messages.title') }}
      </h1>
      <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
        {{ t('dashboard.messages.subtitle') }}
      </p>
    </div>

    <div class="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
      <div
        class="w-full shrink-0 flex-col border-r border-black/10 md:flex md:w-[320px] dark:border-white/10"
        :class="mobileThreadOpen ? 'hidden' : 'flex'"
      >
        <div class="p-3">
          <UiInput
            v-model="search"
            icon="search"
            :placeholder="t('dashboard.messages.searchPlaceholder')"
          />
        </div>
        <div class="flex-1 overflow-y-auto px-2 pb-3">
          <DashboardConversationList
            :conversations="filteredConversations"
            :active-id="activeId"
            @select="selectConversation"
            @archive="archiveConversation"
          />
        </div>
      </div>

      <div
        class="w-full min-w-0 md:flex md:flex-1"
        :class="mobileThreadOpen ? 'flex' : 'hidden'"
      >
        <DashboardMessageThread
          v-if="activeConversation"
          :conversation="activeConversation"
          :messages="activeMessages"
          @back="mobileThreadOpen = false"
          @send="handleSend"
          @delete="handleDelete"
          @send-quote="handleSendQuote"
          @accept-quote="handleAcceptQuote"
          @decline-quote="handleDeclineQuote"
        />
      </div>
    </div>
  </div>
</template>
