<script setup lang="ts">
import type { EarningsSummary, Transaction } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()

const { data: summary } = await useApi<EarningsSummary>('/dashboard/earnings', {
  key: 'dashboard-earnings',
})
const { data: transactions } = await useApi<Transaction[]>('/dashboard/transactions', {
  key: 'dashboard-transactions',
  default: () => [],
})

const CHART_MAX_PX = 160

const chartBars = computed(() => {
  const history = summary.value?.monthlyHistory ?? []
  const max = Math.max(...history.map(month => month.amountUsd), 1)
  const lastIndex = history.length - 1
  return history.map((month, index) => ({
    ...month,
    heightPx: Math.round((month.amountUsd / max) * CHART_MAX_PX),
    isCurrent: index === lastIndex,
  }))
})

useSeoMeta({
  title: t('dashboard.earnings.title'),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold">
          {{ t('dashboard.earnings.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
          {{ t('dashboard.earnings.subtitle') }}
        </p>
      </div>
    </div>

    <template v-if="summary">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardStatCard
          :label="t('dashboard.earnings.summary.available')"
          :value="`$${summary.availableBalanceUsd.toLocaleString()}`"
          :sublabel="t('dashboard.earnings.summary.availableSub')"
          tone="primary"
        />
        <DashboardStatCard
          :label="t('dashboard.earnings.summary.pending')"
          :value="`$${summary.pendingClearanceUsd.toLocaleString()}`"
          :sublabel="t('dashboard.earnings.summary.pendingSub', { days: summary.pendingClearanceDays })"
          tone="accent"
        />
        <DashboardStatCard
          :label="t('dashboard.earnings.summary.paidOut')"
          :value="`$${summary.paidOutThisMonthUsd.toLocaleString()}`"
        />
        <DashboardStatCard
          :label="t('dashboard.earnings.summary.lifetime')"
          :value="`$${summary.lifetimeEarningsUsd.toLocaleString()}`"
        />
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 class="mb-5 font-display text-[15px] font-bold">
            {{ t('dashboard.earnings.chartHeading') }}
          </h2>
          <div
            class="flex items-end gap-4"
            style="height: 160px;"
          >
            <div
              v-for="month in chartBars"
              :key="month.label"
              class="flex flex-1 flex-col items-center gap-2"
            >
              <div
                class="w-7 rounded-t-md"
                :class="month.isCurrent ? 'bg-brand-600' : 'bg-brand-50 dark:bg-brand-700/20'"
                :style="{ height: `${month.heightPx}px` }"
              />
              <span
                class="text-[11.5px]"
                :class="month.isCurrent ? 'font-bold text-black dark:text-white' : 'text-black/40 dark:text-white/40'"
              >{{ month.label }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3.5 rounded-2xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.04]">
          <h2 class="font-display text-[15px] font-bold">
            {{ t('dashboard.earnings.payoutMethodHeading') }}
          </h2>
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
              <UiIcon
                name="wallet"
                :size="18"
              />
            </span>
            <div>
              <div class="text-sm font-bold">
                {{ summary.payoutMethod.label }}
              </div>
              <div class="text-xs text-black/60 dark:text-white/60">
                {{ summary.payoutMethod.sublabel }}
              </div>
            </div>
          </div>
          <UiButton
            variant="primary"
            class="mt-auto"
          >
            {{ t('dashboard.earnings.withdraw', { amount: summary.availableBalanceUsd }) }}
          </UiButton>
          <UiButton variant="ghost">
            {{ t('dashboard.earnings.changePayoutMethod') }}
          </UiButton>
        </div>
      </div>

      <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 class="mb-4 font-display text-base font-bold">
          {{ t('dashboard.earnings.transactionsHeading') }}
        </h2>
        <DashboardTransactionsTable :transactions="transactions ?? []" />
      </div>
    </template>
  </div>
</template>
