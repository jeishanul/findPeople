<script setup lang="ts">
// Auto-imported as <UiInput />. `inheritAttrs: false` + `v-bind="$attrs"` on
// the `<input>` so an `id` (or any other attr) passed by the caller lands on
// the real form control — needed so an external `<label for="...">` actually
// associates with it, rather than with this component's wrapping `<div>`.
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    id?: string
    type?: 'text' | 'tel' | 'email'
    placeholder?: string
    icon?: IconName
  }>(),
  {
    id: undefined,
    type: 'text',
    placeholder: undefined,
    icon: undefined,
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 py-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5">
    <UiIcon
      v-if="icon"
      :name="icon"
      :size="16"
      class="shrink-0 text-black/40 dark:text-white/40"
    />
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      v-bind="$attrs"
      class="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
    >
  </div>
</template>
