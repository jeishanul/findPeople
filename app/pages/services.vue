<script setup lang="ts">
import type { ServiceListing } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()

const { data: services } = await useApi<ServiceListing[]>('/dashboard/services', {
  key: 'dashboard-services',
  default: () => [],
})

const overrides = ref<Record<string, ServiceListing['status']>>({})

const listings = computed(() =>
  (services.value ?? []).map(service => ({
    ...service,
    status: overrides.value[service.id] ?? service.status,
  })),
)

function toggleStatus(id: string) {
  const current = listings.value.find(service => service.id === id)
  if (!current) return
  overrides.value = {
    ...overrides.value,
    [id]: current.status === 'active' ? 'paused' : 'active',
  }
}

const activeCount = computed(() => listings.value.filter(service => service.status === 'active').length)
const totalBookings = computed(() => listings.value.reduce((sum, service) => sum + service.bookingsCount, 0))
const averageRating = computed(() => {
  if (listings.value.length === 0) return 0
  return listings.value.reduce((sum, service) => sum + service.rating, 0) / listings.value.length
})

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
      <UiButton variant="primary">
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
      />
    </div>
  </div>
</template>
