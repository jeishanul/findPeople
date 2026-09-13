<script setup lang="ts">
// Auto-imported as <OgImageMarketplace />. Used by content pages that diverge
// from the plain Default template — browse and provider profiles.
withDefaults(
  defineProps<{
    title: string
    description?: string
    eyebrow?: string
  }>(),
  { description: undefined, eyebrow: undefined },
)
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center bg-brand-600 px-16">
    <p
      v-if="eyebrow"
      class="text-xl font-semibold text-white/70 mb-3"
    >
      {{ eyebrow }}
    </p>
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
