<script setup lang="ts">
// Auto-imported as <OgImageDefault />. Satori-rendered: flex only, no grid,
// no unsized absolute positioning. Add more templates in this directory as
// pages/content types diverge (e.g. OgImage/Article.vue).
withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  { description: undefined },
)
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center bg-brand-700 px-16">
    <h1 class="text-6xl font-bold text-white">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="mt-4 text-2xl text-white/80"
    >
      {{ description }}
    </p>
  </div>
</template>
