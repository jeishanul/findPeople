<script setup lang="ts">
import type { BookingStatus, ClientServed } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()

const { data: clients } = await useApi<ClientServed[]>('/dashboard/clients', {
  key: 'dashboard-clients',
  default: () => [],
})

const filter = ref<string>('all')
const search = ref('')

const filterOptions = computed(() => {
  const list = clients.value ?? []
  const countFor = (status: BookingStatus | 'all') =>
    status === 'all' ? list.length : list.filter(client => client.status === status).length

  return [
    { value: 'all', label: t('dashboard.clients.filters.all'), count: countFor('all') },
    { value: 'completed', label: t('dashboard.clients.filters.completed'), count: countFor('completed') },
    { value: 'upcoming', label: t('dashboard.clients.filters.upcoming'), count: countFor('upcoming') },
    { value: 'cancelled', label: t('dashboard.clients.filters.cancelled'), count: countFor('cancelled') },
  ]
})

const filteredClients = computed(() => {
  const query = search.value.trim().toLowerCase()
  return (clients.value ?? [])
    .filter(client => filter.value === 'all' || client.status === filter.value)
    .filter(client => !query || client.clientName.toLowerCase().includes(query))
})

const totalEarned = computed(() => (clients.value ?? []).reduce((sum, client) => sum + client.amountUsd, 0))
const repeatCount = computed(() => (clients.value ?? []).filter(client => client.repeatClient).length)

useSeoMeta({
  title: t('dashboard.clients.title'),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="font-display text-2xl font-bold">
        {{ t('dashboard.clients.title') }}
      </h1>
      <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
        {{ t('dashboard.clients.subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <DashboardStatCard
        :label="t('dashboard.clients.summary.total')"
        :value="String((clients ?? []).length)"
      />
      <DashboardStatCard
        :label="t('dashboard.clients.summary.repeat')"
        :value="String(repeatCount)"
      />
      <DashboardStatCard
        :label="t('dashboard.clients.summary.earned')"
        :value="`$${totalEarned.toLocaleString()}`"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <DashboardFilterTabs
        v-model="filter"
        :options="filterOptions"
      />
      <UiInput
        v-model="search"
        icon="search"
        class="w-full sm:w-64"
        :placeholder="t('dashboard.clients.searchPlaceholder')"
      />
    </div>

    <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <DashboardClientsTable :clients="filteredClients" />
    </div>
  </div>
</template>
