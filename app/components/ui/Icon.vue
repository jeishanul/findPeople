<script setup lang="ts">
// Auto-imported as <UiIcon />. Renders one of the compound single-`d` paths
// from `app/utils/icons.ts` — stroke-based, 24x24 grid, inherits `currentColor`.
withDefaults(
  defineProps<{
    name: IconName
    size?: number
    filled?: boolean
  }>(),
  {
    size: 20,
    filled: false,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    :stroke="filled ? 'none' : 'currentColor'"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="ICONS[name]" />
  </svg>
</template>
