<script setup lang="ts">
// Auto-imported as <UiButton /> (nested dir name becomes the prefix).
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    /** `sm` for compact contexts (table rows, inline actions) — a prop, not
     * a padding/text-size override, since combining Tailwind utilities that
     * touch the same property that way is order-dependent and unreliable. */
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    size: 'md',
  },
)

const variantClasses = BUTTON_VARIANT_CLASS
const sizeClasses = BUTTON_SIZE_CLASS
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[BUTTON_BASE_CLASS, sizeClasses[props.size], 'disabled:cursor-not-allowed disabled:opacity-50', variantClasses[props.variant]]"
  >
    <slot />
  </button>
</template>
