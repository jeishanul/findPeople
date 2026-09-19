<script setup lang="ts">
import type { ServiceListing } from '#shared/types/dashboard'
import type { ServiceCategory } from '#shared/types/marketplace'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()

const { data: services } = await useApi<ServiceListing[]>('/dashboard/services', {
  key: 'dashboard-services',
  default: () => [],
})
const { data: categories } = await useApi<ServiceCategory[]>('/categories', {
  key: 'categories',
  default: () => [],
})

// Local copy seeded from the fetch (same pattern as `profile.vue`'s
// `form`/`syncFormFromProfile`) — there's no save endpoint yet (CLAUDE.md),
// so edits, new services and status toggles all just mutate this copy.
const listings = ref<ServiceListing[]>([])
watch(services, (value) => {
  if (value) listings.value = [...value]
}, { immediate: true })

function toggleStatus(id: string) {
  const service = listings.value.find(item => item.id === id)
  if (!service) return
  service.status = service.status === 'active' ? 'paused' : 'active'
}

function upsertListing(listing: ServiceListing) {
  const index = listings.value.findIndex(item => item.id === listing.id)
  if (index === -1) listings.value = [...listings.value, listing]
  else listings.value = listings.value.map((item, i) => (i === index ? listing : item))
}

const activeCount = computed(() => listings.value.filter(service => service.status === 'active').length)
const totalBookings = computed(() => listings.value.reduce((sum, service) => sum + service.bookingsCount, 0))
const averageRating = computed(() => {
  if (listings.value.length === 0) return 0
  return listings.value.reduce((sum, service) => sum + service.rating, 0) / listings.value.length
})

// --- Add/edit form + preview modals ----------------------------------------

const isFormOpen = ref(false)
const editingService = ref<ServiceListing | null>(null)
const isPreviewOpen = ref(false)
const previewingService = ref<ServiceListing | null>(null)

function openCreateForm() {
  editingService.value = null
  isFormOpen.value = true
}

function openEditForm(service: ServiceListing) {
  editingService.value = service
  isFormOpen.value = true
}

function openPreview(service: ServiceListing) {
  previewingService.value = service
  isPreviewOpen.value = true
}

function handleFormSubmit(listing: ServiceListing) {
  upsertListing(listing)
  isFormOpen.value = false
}

useSeoMeta({
  title: t('dashboard.services.title'),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold">
          {{ t('dashboard.services.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
          {{ t('dashboard.services.subtitle') }}
        </p>
      </div>
      <UiButton
        variant="primary"
        @click="openCreateForm"
      >
        <UiIcon
          name="plus"
          :size="15"
        />{{ t('dashboard.services.addService') }}
      </UiButton>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <DashboardStatCard
        :label="t('dashboard.services.summary.active')"
        :value="String(activeCount)"
      />
      <DashboardStatCard
        :label="t('dashboard.services.summary.bookings')"
        :value="String(totalBookings)"
      />
      <DashboardStatCard
        :label="t('dashboard.services.summary.rating')"
        :value="averageRating.toFixed(1)"
      />
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <DashboardServiceCard
        v-for="service in listings"
        :key="service.id"
        :service="service"
        @toggle-status="toggleStatus"
        @edit="openEditForm"
        @preview="openPreview"
      />
    </div>

    <DashboardServiceFormModal
      :open="isFormOpen"
      :categories="categories ?? []"
      :service="editingService"
      @close="isFormOpen = false"
      @submit="handleFormSubmit"
    />
    <DashboardServicePreviewModal
      :open="isPreviewOpen"
      :service="previewingService"
      @close="isPreviewOpen = false"
    />
  </div>
</template>
