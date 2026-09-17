<script setup lang="ts">
import type { Transaction, TransactionType } from '#shared/types/dashboard'

// Auto-imported as <DashboardTransactionsTable/>. The ledger on the earnings
// page — booking income in green, payouts/refunds as a plain deduction.
defineProps<{
  transactions: Transaction[]
}>()

const { t } = useI18n()

const VARIANT_BY_TYPE: Record<TransactionType, 'neutral' | 'accent' | 'danger'> = {
  booking: 'neutral',
  payout: 'accent',
  refund: 'danger',
}

function amountLabel(amountUsd: number) {
  const sign = amountUsd >= 0 ? '+' : '-'
  return `${sign}$${Math.abs(amountUsd).toFixed(2)}`
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[560px] border-collapse text-sm">
      <thead>
        <tr class="border-b border-black/10 text-left text-xs font-bold tracking-wide text-black/40 uppercase dark:border-white/10 dark:text-white/40">
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.earnings.table.description') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.earnings.table.date') }}
          </th>
          <th class="pb-3 pr-3 font-bold">
            {{ t('dashboard.earnings.table.type') }}
          </th>
          <th class="pb-3 font-bold">
            {{ t('dashboard.earnings.table.amount') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in transactions"
          :key="transaction.id"
          class="border-b border-black/10 last:border-0 dark:border-white/10"
        >
          <td class="py-3.5 pr-3 font-semibold">
            {{ transaction.description }}
          </td>
          <td class="py-3.5 pr-3 text-black/60 dark:text-white/60">
            {{ transaction.date }}
          </td>
          <td class="py-3.5 pr-3">
            <UiTag :variant="VARIANT_BY_TYPE[transaction.type]">
              {{ t(`dashboard.earnings.types.${transaction.type}`) }}
            </UiTag>
          </td>
          <td
            class="py-3.5 font-bold"
            :class="transaction.amountUsd >= 0 && 'text-brand-700 dark:text-brand-100'"
          >
            {{ amountLabel(transaction.amountUsd) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
