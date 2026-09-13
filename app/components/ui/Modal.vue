<script setup lang="ts">
// Auto-imported as <UiModal />. Generic dialog chrome (backdrop, close
// affordance, scroll lock, Escape-to-close) — content is the default slot.
// Feature components (e.g. `MarketplaceAuthModal`) own what's inside.
const props = withDefaults(
  defineProps<{
    open: boolean
    labelledby?: string
  }>(),
  { labelledby: undefined },
)

const emit = defineEmits<{
  close: []
}>()

const dialogRef = useTemplateRef('dialogRef')

watch(() => props.open, (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) nextTick(() => dialogRef.value?.focus())
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

onKeyStroke('Escape', () => {
  if (props.open) emit('close')
})
</script>

<template>
  <!-- `#teleports`, not `body` — Nuxt reserves this element right after
       `#__nuxt` specifically so teleported content stacks above the app
       (e.g. the sticky header) instead of Vue inserting it before `#__nuxt`,
       which put an equal-z-index header on top and swallowed clicks. -->
  <Teleport to="#teleports">
    <Transition name="ui-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        <!-- Decorative click-to-dismiss backdrop, not a real control — Escape
             (bound above via onKeyStroke) already gives keyboard users a way
             to close, so a fake button role here would be misleading. -->
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
        <div
          class="absolute inset-0 bg-black/55 backdrop-blur-sm"
          @click="emit('close')"
        />
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="labelledby"
          tabindex="-1"
          class="relative w-full max-w-[440px] rounded-[28px] bg-white p-9 shadow-2xl outline-none dark:bg-black"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.ui-modal-enter-active,
.ui-modal-leave-active {
  @apply transition-opacity duration-200;
}
.ui-modal-enter-active > div:last-child,
.ui-modal-leave-active > div:last-child {
  @apply transition-all duration-200;
}
.ui-modal-enter-from,
.ui-modal-leave-to {
  @apply opacity-0;
}
.ui-modal-enter-from > div:last-child,
.ui-modal-leave-to > div:last-child {
  @apply translate-y-2 scale-95;
}
</style>
