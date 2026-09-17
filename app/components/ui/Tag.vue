<script setup lang="ts">
// Auto-imported as <UiTag />. Small pill used for skill/category tags and the
// verified badge.
const props = withDefaults(
  defineProps<{
    variant?: 'neutral' | 'primary' | 'accent' | 'danger'
    /** `sm` for tight contexts (sidebar badges, inline table pills). */
    size?: 'sm' | 'md'
  }>(),
  { variant: 'neutral', size: 'md' },
)

const variantClasses: Record<'neutral' | 'primary' | 'accent' | 'danger', string> = {
  neutral: 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60',
  primary: 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-100',
  danger: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const sizeClasses: Record<'sm' | 'md', string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1.5 text-xs',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-semibold"
    :class="[sizeClasses[props.size], variantClasses[props.variant]]"
  >
    <slot />
  </span>
</template>
