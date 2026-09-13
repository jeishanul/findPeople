<script setup lang="ts">
// Auto-imported as <UiButton /> (nested dir name becomes the prefix).
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
)

const variantClasses: Record<NonNullable<typeof props.variant>, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-brand-100 text-brand-700 hover:bg-brand-100/80',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50',
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="variantClasses[props.variant]"
  >
    <slot />
  </button>
</template>
