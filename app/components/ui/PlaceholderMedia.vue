<script setup lang="ts">
// Auto-imported as <UiPlaceholderMedia />. A solid-color stand-in for a real
// photo/illustration, sized entirely by the parent (width/height or
// aspect-ratio) — used everywhere the design calls for imagery, per the
// "solid dummy placeholders with specified dimensions" requirement.
withDefaults(
  defineProps<{
    icon: IconName
    tone?: 'primary' | 'accent'
    label?: string
  }>(),
  {
    tone: 'primary',
    label: undefined,
  },
)

const toneClasses: Record<'primary' | 'accent', string> = {
  primary: 'bg-brand-50 text-brand-600 dark:bg-brand-700/20 dark:text-brand-100',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-700/20 dark:text-accent-100',
}
</script>

<template>
  <div
    class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit]"
    :class="toneClasses[tone]"
  >
    <UiIcon
      :name="icon"
      :size="40"
      class="opacity-70"
    />
    <span
      v-if="label"
      class="absolute bottom-2.5 right-3 text-[11px] font-semibold opacity-60"
    >{{ label }}</span>
  </div>
</template>
