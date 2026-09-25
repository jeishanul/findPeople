<script setup lang="ts">
import type { Quote } from '#shared/types/dashboard'

// Auto-imported as <DashboardQuoteCard/>. Renders in place of a plain
// text/attachment bubble when a message carries a structured `quote` (see
// `shared/types/dashboard.ts`). Accept/Decline show only while the quote is
// pending AND the viewer is the recipient — the backend (`QuoteController`)
// only lets the conversation's consumer accept/decline, so the provider who
// sent it never sees the buttons on their own message.
defineProps<{
  quote: Quote
  canRespond: boolean
}>()

defineEmits<{
  accept: []
  decline: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="w-64 max-w-full overflow-hidden rounded-xl border border-black/10 bg-white text-black dark:border-white/15 dark:bg-black/40 dark:text-white">
    <div class="flex items-center gap-2 border-b border-black/10 bg-accent-50 px-3.5 py-2 dark:border-white/10 dark:bg-accent-700/20">
      <UiIcon
        name="briefcase"
        :size="14"
        class="text-accent-700 dark:text-accent-100"
      />
      <span class="text-xs font-bold text-accent-700 dark:text-accent-100">{{ t('dashboard.messages.quote.cardHeading') }}</span>
    </div>
    <div class="flex flex-col gap-2 px-3.5 py-3">
      <div class="flex items-baseline justify-between">
        <span class="font-display text-lg font-bold">${{ quote.basePriceUsd }}</span>
        <span class="text-xs text-black/50 dark:text-white/50">{{ t('dashboard.messages.quote.forHours', { hours: quote.baseHours }) }}</span>
      </div>
      <p
        v-if="quote.extraHourlyRateUsd > 0"
        class="text-xs text-black/60 dark:text-white/60"
      >
        {{ t('dashboard.messages.quote.extraRateNote', { rate: quote.extraHourlyRateUsd }) }}
      </p>
      <p
        v-if="quote.note"
        class="text-xs text-black/60 dark:text-white/60"
      >
        {{ quote.note }}
      </p>

      <div
        v-if="quote.status === 'pending' && canRespond"
        class="mt-1.5 flex gap-2"
      >
        <UiButton
          variant="primary"
          size="sm"
          class="flex-1"
          @click="$emit('accept')"
        >
          {{ t('dashboard.messages.quote.accept') }}
        </UiButton>
        <UiButton
          variant="ghost"
          size="sm"
          class="flex-1"
          @click="$emit('decline')"
        >
          {{ t('dashboard.messages.quote.decline') }}
        </UiButton>
      </div>
      <UiTag
        v-else
        :variant="quote.status === 'accepted' ? 'primary' : 'neutral'"
        class="mt-1 w-fit"
      >
        {{ quote.status === 'pending' ? t('dashboard.messages.quote.pending')
          : quote.status === 'accepted' ? t('dashboard.messages.quote.accepted')
            : t('dashboard.messages.quote.declined') }}
      </UiTag>
    </div>
  </div>
</template>
