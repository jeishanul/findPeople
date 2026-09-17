<script setup lang="ts">
import type { Conversation, ConversationMessage, MessageAttachment } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()

const { data: conversations } = await useApi<Conversation[]>('/dashboard/conversations', {
  key: 'dashboard-conversations',
  default: () => [],
})

const search = ref('')
const activeId = ref('')

// Local, mutable copy of each thread's messages — there's no send/delete
// backend yet (see `MarketplaceAuthModal` for the same "UI-only" pattern),
// so sending/deleting only ever changes this in-memory state, seeded once
// from the fetched conversations.
const messagesByConversation = ref<Record<string, ConversationMessage[]>>({})

watch(conversations, (list) => {
  if (!list) return
  for (const conversation of list) {
    if (!messagesByConversation.value[conversation.id]) {
      messagesByConversation.value[conversation.id] = [...conversation.messages]
    }
  }
  if (!activeId.value && list.length > 0) {
    activeId.value = list[0]!.id
  }
}, { immediate: true })

const filteredConversations = computed(() => {
  const query = search.value.trim().toLowerCase()
  return (conversations.value ?? []).filter(conversation => !query || conversation.personName.toLowerCase().includes(query))
})

const activeConversation = computed(() =>
  (conversations.value ?? []).find(conversation => conversation.id === activeId.value) ?? conversations.value?.[0],
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

function handleSend({ text, attachment }: { text: string, attachment?: MessageAttachment }) {
  const conversationId = activeId.value
  const messageId = `local-${Date.now()}`
  const message: ConversationMessage = { id: messageId, fromMe: true, text, attachment, status: 'sent' }

  messagesByConversation.value = {
    ...messagesByConversation.value,
    [conversationId]: [...(messagesByConversation.value[conversationId] ?? []), message],
  }

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

useSeoMeta({
  title: t('dashboard.messages.title'),
})
</script>

<template>
  <div class="flex h-[calc(100vh-160px)] min-h-[560px] flex-col gap-5">
    <div>
      <h1 class="font-display text-2xl font-bold">
        {{ t('dashboard.messages.title') }}
      </h1>
      <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
        {{ t('dashboard.messages.subtitle') }}
      </p>
    </div>

    <div class="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
      <div class="flex w-[320px] shrink-0 flex-col border-r border-black/10 dark:border-white/10">
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
            @select="activeId = $event"
          />
        </div>
      </div>

      <DashboardMessageThread
        v-if="activeConversation"
        :conversation="activeConversation"
        :messages="activeMessages"
        @send="handleSend"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
