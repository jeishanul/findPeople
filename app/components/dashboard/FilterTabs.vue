<script setup lang="ts">
// Auto-imported as <DashboardFilterTabs/>. Generic status-filter pill row
// shared by the clients-served and purchases pages.
defineProps<{
  options: Array<{ value: string, label: string, count: number }>
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full border px-4 py-2 text-xs font-bold transition-colors"
      :class="model === option.value
        ? 'border-brand-600 bg-brand-600 text-white'
        : 'border-black/10 bg-white text-black/60 hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:text-white'"
      @click="model = option.value"
    >
      {{ option.label }} ({{ option.count }})
    </button>
  </div>
</template>
