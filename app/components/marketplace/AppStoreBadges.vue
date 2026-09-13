<script setup lang="ts">
// Auto-imported as <MarketplaceAppStoreBadges />. Generic (non-trademarked)
// badge styling — text-labelled rather than reproducing Apple/Google's
// registered badge artwork.
withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <a
      href="#"
      class="flex h-[38px] w-[134px] items-center justify-center gap-2 rounded-lg text-xs font-bold"
      :class="tone === 'light'
        ? 'border border-black/10 bg-white text-black'
        : 'bg-white/10 text-white'"
    >
      <UiIcon
        name="smartphone"
        :size="15"
      />
      {{ t('marketplace.downloadApp.googlePlay') }}
    </a>
    <a
      href="#"
      class="flex h-[38px] w-[134px] items-center justify-center gap-2 rounded-lg text-xs font-bold"
      :class="tone === 'light'
        ? 'border border-black/10 bg-white text-black'
        : 'bg-white/10 text-white'"
    >
      <UiIcon
        name="smartphone"
        :size="15"
      />
      {{ t('marketplace.downloadApp.appStore') }}
    </a>
  </div>
</template>
