<script setup lang="ts">
import type { ServiceCategory } from '#shared/types/marketplace'
import type { ServiceListing } from '#shared/types/dashboard'

// Auto-imported as <DashboardServiceFormModal/>. Add/edit form for a single
// service listing — `service: null` means "create new" (services.vue owns
// the actual list; this only emits the finished listing). No save endpoint
// yet (see CLAUDE.md — mock data only), so submitting just hands the parent
// a plain `ServiceListing` object to upsert into its local copy.
const props = defineProps<{
  open: boolean
  categories: ServiceCategory[]
  service: ServiceListing | null
}>()

const emit = defineEmits<{
  close: []
  submit: [ServiceListing]
}>()

const { t } = useI18n()
const titleId = useId()

const form = reactive({
  title: '',
  categoryId: null as string | null,
  description: '',
  durationLabel: '',
  priceLabel: '',
})

function resetForm() {
  form.title = props.service?.title ?? ''
  form.categoryId = props.service?.categoryId ?? null
  form.description = props.service?.description ?? ''
  form.durationLabel = props.service?.durationLabel ?? ''
  form.priceLabel = props.service?.priceLabel ?? ''
}

watch(() => props.open, (isOpen) => {
  if (isOpen) resetForm()
})

const categoryOptions = computed(() =>
  props.categories.map(category => ({ value: category.id, label: t(`marketplace.categories.${category.id}.label`) })),
)

const isValid = computed(() =>
  form.title.trim().length > 0
  && form.categoryId
  && form.description.trim().length > 0
  && form.durationLabel.trim().length > 0
  && form.priceLabel.trim().length > 0,
)

function handleSubmit() {
  if (!isValid.value || !form.categoryId) return
  emit('submit', {
    id: props.service?.id ?? `sv-local-${Date.now()}`,
    title: form.title.trim(),
    categoryId: form.categoryId,
    description: form.description.trim(),
    durationLabel: form.durationLabel.trim(),
    priceLabel: form.priceLabel.trim(),
    bookingsCount: props.service?.bookingsCount ?? 0,
    rating: props.service?.rating ?? 0,
    status: props.service?.status ?? 'active',
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
      class="mb-5 font-display text-xl font-bold"
    >
      {{ service ? t('dashboard.services.form.editTitle') : t('dashboard.services.form.addTitle') }}
    </h2>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label
          for="service-form-title"
          class="mb-1.5 block text-xs font-bold"
        >{{ t('dashboard.services.form.titleLabel') }}</label>
        <UiInput
          id="service-form-title"
          v-model="form.title"
        />
      </div>

      <div>
        <label
          for="service-form-category"
          class="mb-1.5 block text-xs font-bold"
        >{{ t('dashboard.services.form.categoryLabel') }}</label>
        <UiSelectSearch
          id="service-form-category"
          v-model="form.categoryId"
          :options="categoryOptions"
          :placeholder="t('dashboard.services.form.categoryPlaceholder')"
        />
      </div>

      <div>
        <label
          for="service-form-description"
          class="mb-1.5 block text-xs font-bold"
        >{{ t('dashboard.services.form.descriptionLabel') }}</label>
        <textarea
          id="service-form-description"
          v-model="form.description"
          rows="3"
          class="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label
            for="service-form-duration"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('dashboard.services.form.durationLabel') }}</label>
          <UiInput
            id="service-form-duration"
            v-model="form.durationLabel"
            :placeholder="t('dashboard.services.form.durationPlaceholder')"
          />
        </div>
        <div>
          <label
            for="service-form-price"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('dashboard.services.form.priceLabel') }}</label>
          <UiInput
            id="service-form-price"
            v-model="form.priceLabel"
            :placeholder="t('dashboard.services.form.pricePlaceholder')"
          />
        </div>
      </div>

      <div class="mt-2 flex justify-end gap-2.5">
        <UiButton
          type="button"
          variant="ghost"
          @click="emit('close')"
        >
          {{ t('dashboard.services.form.cancel') }}
        </UiButton>
        <UiButton
          type="submit"
          variant="primary"
          :disabled="!isValid"
        >
          {{ service ? t('dashboard.services.form.save') : t('dashboard.services.form.create') }}
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
