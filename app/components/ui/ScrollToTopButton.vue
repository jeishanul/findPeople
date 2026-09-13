<script setup lang="ts">
// Auto-imported as <UiScrollToTopButton />. Site-wide (mounted once in the
// default layout) — appears after the page has been scrolled down a bit,
// regardless of which page/content is under it.
const { t } = useI18n()

const visible = ref(false)

function updateVisibility() {
  visible.value = window.scrollY > 480
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

if (import.meta.client) {
  useEventListener(window, 'scroll', updateVisibility, { passive: true })
  onMounted(updateVisibility)
}
</script>

<template>
  <Transition name="fab-fade">
    <button
      v-if="visible"
      type="button"
      class="fixed bottom-8 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-colors hover:bg-brand-700"
      :aria-label="t('ui.scrollToTop')"
      @click="scrollToTop"
    >
      <UiIcon
        name="chevron-down"
        class="rotate-180"
        :size="20"
      />
    </button>
  </Transition>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.fab-fade-enter-active,
.fab-fade-leave-active {
  @apply transition-all duration-300;
}
.fab-fade-enter-from,
.fab-fade-leave-to {
  @apply translate-y-2 opacity-0;
}
</style>
