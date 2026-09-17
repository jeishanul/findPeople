<script setup lang="ts">
import type { ClientServed, DashboardSummary, PurchaseRecord } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()
const session = useSession()

const roleQuery = computed(() => ({ role: session.activeRole.value }))
const { data: summary } = await useApi<DashboardSummary>('/dashboard/summary', {
  key: 'dashboard-summary',
  query: roleQuery,
})

const { data: clients } = await useApi<ClientServed[]>('/dashboard/clients', {
  key: 'dashboard-clients-preview',
  default: () => [],
})
const { data: purchases } = await useApi<PurchaseRecord[]>('/dashboard/purchases', {
  key: 'dashboard-purchases-preview',
  default: () => [],
})

const isProvider = computed(() => session.activeRole.value === 'provider')

useSeoMeta({
  title: t('dashboard.overview.title'),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold">
          {{ t('dashboard.overview.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
          {{ t('dashboard.overview.greeting', { name: session.name.value }) }}
        </p>
      </div>
    </div>

    <DashboardDualRoleBanner />

    <template v-if="summary">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <template v-if="isProvider">
          <DashboardStatCard
            :label="t('dashboard.overview.provider.kpi.activeGigs')"
            :value="String(summary.providerKpis.activeGigs)"
          />
          <DashboardStatCard
            :label="t('dashboard.overview.provider.kpi.earnings')"
            :value="`$${summary.providerKpis.earningsThisMonthUsd.toLocaleString()}`"
            :sublabel="t('dashboard.overview.provider.kpi.earningsSub', { percent: summary.providerKpis.earningsChangePercent })"
            tone="primary"
          />
          <DashboardStatCard
            :label="t('dashboard.overview.provider.kpi.clientsServed')"
            :value="String(summary.providerKpis.clientsServed)"
            :sublabel="t('dashboard.overview.provider.kpi.clientsServedSub', { count: summary.providerKpis.repeatClients })"
          />
          <DashboardStatCard
            :label="t('dashboard.overview.provider.kpi.rating')"
            :value="summary.providerKpis.averageRating.toFixed(1)"
            :sublabel="t('dashboard.overview.provider.kpi.ratingSub', { count: summary.providerKpis.reviewCount })"
            tone="accent"
          />
        </template>
        <template v-else>
          <DashboardStatCard
            :label="t('dashboard.overview.consumer.kpi.activeOrders')"
            :value="String(summary.consumerKpis.activeOrders)"
            :sublabel="t('dashboard.overview.consumer.kpi.activeOrdersSub', { count: summary.consumerKpis.ordersInProgress })"
            tone="primary"
          />
          <DashboardStatCard
            :label="t('dashboard.overview.consumer.kpi.totalSpent')"
            :value="`$${summary.consumerKpis.totalSpentUsd.toLocaleString()}`"
            :sublabel="t('dashboard.overview.consumer.kpi.totalSpentSub', { count: summary.consumerKpis.totalOrders })"
          />
          <DashboardStatCard
            :label="t('dashboard.overview.consumer.kpi.providersHired')"
            :value="String(summary.consumerKpis.providersHired)"
            :sublabel="t('dashboard.overview.consumer.kpi.providersHiredSub', { count: summary.consumerKpis.providersHiredTwice })"
          />
          <DashboardStatCard
            :label="t('dashboard.overview.consumer.kpi.savedProviders')"
            :value="String(summary.consumerKpis.savedProviders)"
            :sublabel="t('dashboard.overview.consumer.kpi.savedProvidersSub', { count: summary.consumerKpis.savedProvidersAvailableNow })"
            tone="accent"
          />
        </template>
      </div>

      <DashboardKycBanner
        v-if="isProvider"
        :kyc="summary.kyc"
      />
      <div
        v-else
        class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 p-5 dark:border-white/10"
      >
        <div class="flex items-center gap-3.5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
            <UiIcon
              name="wallet"
              :size="21"
            />
          </span>
          <div>
            <div class="text-[15px] font-bold">
              {{ t('dashboard.overview.consumer.paymentNudge.title') }}
            </div>
            <div class="mt-0.5 text-xs text-black/60 dark:text-white/60">
              {{ t('dashboard.overview.consumer.paymentNudge.body') }}
            </div>
          </div>
        </div>
        <UiButton variant="ghost">
          {{ t('dashboard.overview.consumer.paymentNudge.cta') }}
        </UiButton>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-display text-base font-bold">
              {{ t('dashboard.overview.activity.heading') }}
            </h2>
          </div>
          <DashboardActivityFeed :items="summary.activity" />
        </div>

        <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 class="mb-3.5 font-display text-base font-bold">
            {{ isProvider ? t('dashboard.sidebar.myServices') : t('dashboard.sidebar.browseServices') }}
          </h2>
          <div class="flex flex-col gap-2.5">
            <template v-if="isProvider">
              <UiButton
                variant="secondary"
                class="justify-start!"
              >
                <UiIcon
                  name="plus"
                  :size="16"
                />{{ t('dashboard.overview.provider.quickActions.addService') }}
              </UiButton>
              <UiButton
                variant="ghost"
                class="justify-start!"
              >
                <UiIcon
                  name="calendar"
                  :size="16"
                />{{ t('dashboard.overview.provider.quickActions.updateAvailability') }}
              </UiButton>
              <NuxtLinkLocale
                :to="{ path: '/profile', query: { tab: 'kyc' } }"
                :class="[linkButtonClass('ghost'), 'w-full justify-start!']"
              >
                <UiIcon
                  name="shield-check"
                  :size="16"
                />{{ t('dashboard.overview.provider.quickActions.finishKyc') }}
              </NuxtLinkLocale>
            </template>
            <template v-else>
              <NuxtLinkLocale
                to="/browse"
                :class="[linkButtonClass('secondary'), 'w-full justify-start!']"
              >
                <UiIcon
                  name="search"
                  :size="16"
                />{{ t('dashboard.overview.consumer.quickActions.browse') }}
              </NuxtLinkLocale>
              <UiButton
                variant="ghost"
                class="justify-start!"
              >
                <UiIcon
                  name="message"
                  :size="16"
                />{{ t('dashboard.overview.consumer.quickActions.message') }}
              </UiButton>
              <UiButton
                variant="ghost"
                class="justify-start!"
              >
                <UiIcon
                  name="star"
                  :size="16"
                />{{ t('dashboard.overview.consumer.quickActions.review') }}
              </UiButton>
            </template>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div class="mb-3.5 flex items-center justify-between">
          <h2 class="font-display text-base font-bold">
            {{ isProvider ? t('dashboard.overview.provider.recentTable.heading') : t('dashboard.overview.consumer.recentTable.heading') }}
          </h2>
          <NuxtLinkLocale
            :to="isProvider ? '/clients' : '/purchases'"
            :class="linkButtonClass('ghost', 'sm')"
          >
            {{ t('dashboard.table.viewAll') }}
          </NuxtLinkLocale>
        </div>
        <DashboardClientsTable
          v-if="isProvider"
          :clients="clients ?? []"
          :limit="3"
        />
        <DashboardPurchasesTable
          v-else
          :purchases="purchases ?? []"
          :limit="3"
        />
      </div>
    </template>
  </div>
</template>
