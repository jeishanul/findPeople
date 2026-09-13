<script setup lang="ts">
// Auto-imported as <UiTag />. Small pill used for skill/category tags and the
// verified badge.
const props = withDefaults(
  defineProps<{
    variant?: 'neutral' | 'primary'
  }>(),
  { variant: 'neutral' },
)

const variantClasses: Record<'neutral' | 'primary', string> = {
  neutral: 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60',
  primary: 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
    :class="variantClasses[props.variant]"
  >
    <slot />
  </span>
</template>
