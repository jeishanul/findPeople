<script setup lang="ts">
// Auto-imported as <DashboardQuoteFormModal/>. The provider's "send a
// structured price" form — base price + base hours + an hourly rate for
// extra work beyond that, plus an optional note. Posts as a distinct quote
// card in the chat (see <DashboardQuoteCard/>) rather than a plain text
// message, so the consumer gets clear Accept/Decline actions instead of
// having to parse a price out of free text.
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [{ basePriceUsd: number, baseHours: number, extraHourlyRateUsd: number, note: string }]
}>()

const { t } = useI18n()
const titleId = useId()

const basePriceUsd = ref(0)
const baseHours = ref(0)
const extraHourlyRateUsd = ref(0)
const note = ref('')

function resetForm() {
  basePriceUsd.value = 0
  baseHours.value = 0
  extraHourlyRateUsd.value = 0
  note.value = ''
}

watch(() => props.open, (isOpen) => {
  if (isOpen) resetForm()
})

const isValid = computed(() => basePriceUsd.value > 0 && baseHours.value > 0)

function parseAmount(value: string) {
  return Number(value.replace(/[^\d.]/g, '')) || 0
}

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', {
    basePriceUsd: basePriceUsd.value,
    baseHours: baseHours.value,
    extraHourlyRateUsd: extraHourlyRateUsd.value,
    note: note.value.trim(),
  })
}
</script>

<template>
  <UiModal
    :open="open"
    :labelledby="titleId"
    @close="emit('close')"
  >
    <h2
      :id="titleId"
      class="mb-1.5 font-display text-xl font-bold"
    >
      {{ t('dashboard.messages.quote.formTitle') }}
    </h2>
    <p class="mb-5 text-sm text-black/60 dark:text-white/60">
      {{ t('dashboard.messages.quote.formSubtitle') }}
    </p>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="handleSubmit"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label
            for="quote-base-price"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('dashboard.messages.quote.basePriceLabel') }}</label>
          <UiInput
            id="quote-base-price"
            :model-value="basePriceUsd ? `$${basePriceUsd}` : ''"
            :placeholder="t('dashboard.messages.quote.basePricePlaceholder')"
            @update:model-value="(v) => (basePriceUsd = parseAmount(v))"
          />
        </div>
        <div>
          <label
            for="quote-base-hours"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('dashboard.messages.quote.baseHoursLabel') }}</label>
          <UiInput
            id="quote-base-hours"
            :model-value="baseHours ? String(baseHours) : ''"
            :placeholder="t('dashboard.messages.quote.baseHoursPlaceholder')"
            @update:model-value="(v) => (baseHours = parseAmount(v))"
          />
        </div>
      </div>

      <div>
        <label
          for="quote-extra-rate"
          class="mb-1.5 block text-xs font-bold"
        >{{ t('dashboard.messages.quote.extraRateLabel') }}</label>
        <UiInput
          id="quote-extra-rate"
          :model-value="extraHourlyRateUsd ? `$${extraHourlyRateUsd}` : ''"
          :placeholder="t('dashboard.messages.quote.extraRatePlaceholder')"
          @update:model-value="(v) => (extraHourlyRateUsd = parseAmount(v))"
        />
        <p class="mt-1.5 text-xs text-black/50 dark:text-white/50">
          {{ t('dashboard.messages.quote.extraRateHelp') }}
        </p>
      </div>

      <div>
        <label
          for="quote-note"
          class="mb-1.5 block text-xs font-bold"
        >{{ t('dashboard.messages.quote.noteLabel') }}</label>
        <textarea
          id="quote-note"
          v-model="note"
          rows="2"
          :placeholder="t('dashboard.messages.quote.notePlaceholder')"
          class="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div class="mt-1 flex justify-end gap-2.5">
        <UiButton
          type="button"
          variant="ghost"
          @click="emit('close')"
        >
          {{ t('dashboard.messages.quote.cancel') }}
        </UiButton>
        <UiButton
          type="submit"
          variant="primary"
          :disabled="!isValid"
        >
          {{ t('dashboard.messages.quote.send') }}
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
