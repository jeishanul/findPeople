<script setup lang="ts">
// Auto-imported as <DashboardStatCard/>. One KPI tile on the dashboard
// overview — value plus an optional tinted sublabel pill.
withDefaults(
  defineProps<{
    label: string
    value: string
    sublabel?: string
    tone?: 'primary' | 'accent' | 'neutral' | 'danger'
  }>(),
  {
    sublabel: undefined,
    tone: 'neutral',
  },
)
</script>

<template>
  <div class="rounded-2xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.06]">
    <div class="text-[13px] font-semibold text-black/60 dark:text-white/60">
      {{ label }}
    </div>
    <div class="mt-1.5 font-display text-[28px] font-bold">
      {{ value }}
    </div>
    <UiTag
      v-if="sublabel"
      :variant="tone"
      class="mt-2.5"
    >
      {{ sublabel }}
    </UiTag>
  </div>
</template>
