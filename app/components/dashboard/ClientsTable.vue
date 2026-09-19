<script setup lang="ts">
import type { ClientServed, Conversation } from '#shared/types/dashboard'

// Auto-imported as <DashboardClientsTable/>. Used both on the dashboard
// overview (a 3-row preview) and the full clients-served page.
const props = withDefaults(
  defineProps<{
    clients: ClientServed[]
    limit?: number
  }>(),
  { limit: undefined },
)

const { t } = useI18n()
const localePath = useLocalePath()

const rows = computed(() => (props.limit ? props.clients.slice(0, props.limit) : props.clients))

const AVATAR_TINTS = [
  'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100',
  'bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-100',
  'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60',
]

function avatarClass(index: number) {
  return AVATAR_TINTS[index % AVATAR_TINTS.length]
}

// Opens (or creates) a thread with this client — see `useConversations`.
const { data: conversations } = useApi<Conversation[]>('/dashboard/conversations', {
  key: 'dashboard-conversations',
  lazy: true,
  default: () => [],
})
const { ensureConversationForCounterpart } = useConversations()

function messageClient(client: ClientServed) {
  const conversationId = ensureConversationForCounterpart(client.clientName, client.categoryId, 'client', conversations.value ?? [])
  navigateTo(localePath({ path: '/messages', query: { conversation: conversationId } }))
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[720px] border-collapse text-sm">
      <thead>
        <tr class="border-b border-black/10 text-left text-xs font-bold tracking-wide text-black/40 uppercase dark:border-white/10 dark:text-white/40">
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.table.client') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.table.service') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.table.date') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.table.rating') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.table.amount') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.table.status') }}
          </th>
          <th class="pb-3 font-bold">
            <span class="sr-only">{{ t('dashboard.table.message') }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(client, index) in rows"
          :key="client.id"
          class="border-b border-black/10 last:border-0 dark:border-white/10"
        >
          <td class="py-3.5 pr-3">
            <div class="flex items-center gap-2.5 font-semibold">
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                :class="avatarClass(index)"
              >
                {{ initialsFor(client.clientName) }}
              </span>
              {{ client.clientName }}
              <UiTag
                v-if="client.repeatClient"
                variant="neutral"
                size="sm"
              >
                {{ t('dashboard.table.repeatBadge') }}
              </UiTag>
            </div>
          </td>
          <td class="py-3.5 pr-3 text-black/60 dark:text-white/60">
            {{ t(`marketplace.categories.${client.categoryId}.label`) }}
          </td>
          <td class="py-3.5 pr-3 text-black/60 dark:text-white/60">
            {{ client.date }}
          </td>
          <td class="py-3.5 pr-3 text-black/60 dark:text-white/60">
            <span
              v-if="client.rating"
              class="inline-flex items-center gap-1"
            >
              <UiIcon
                name="star"
                filled
                :size="13"
                class="text-accent-600"
              />
              {{ client.rating.toFixed(1) }}
            </span>
            <span v-else>—</span>
          </td>
          <td class="py-3.5 pr-3 font-semibold">
            ${{ client.amountUsd }}
          </td>
          <td class="py-3.5 pr-3">
            <DashboardStatusBadge :status="client.status" />
          </td>
          <td class="py-3.5">
            <UiButton
              variant="ghost"
              size="sm"
              @click="messageClient(client)"
            >
              {{ t('dashboard.table.message') }}
            </UiButton>
          </td>
        </tr>
      </tbody>
    </table>

    <p
      v-if="rows.length === 0"
      class="py-8 text-center text-sm text-black/50 dark:text-white/50"
    >
      {{ t('dashboard.clients.empty') }}
    </p>
  </div>
</template>
