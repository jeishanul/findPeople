<script setup lang="ts">
// Auto-imported as <UiRating />.
withDefaults(
  defineProps<{
    rating: number
    reviewCount?: number
  }>(),
  { reviewCount: undefined },
)
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-sm">
    <UiIcon
      name="star"
      filled
      :size="25"
      class="text-accent-600"
    />
    <strong class="font-semibold text-black dark:text-white">{{ rating.toFixed(1) }}</strong>
    <span
      v-if="reviewCount !== undefined"
      class="text-black/50 dark:text-white/50"
    >({{ reviewCount }})</span>
  </span>
</template>
