<script setup lang="ts">
import type { ServiceCategory } from '#shared/types/marketplace'

// Auto-imported as <MarketplaceServiceSearchBar />. Used at full size in the
// landing hero, and again in compact form once it docks into the header (see
// `useHeroSearchDock`) and atop the browse results page.
withDefaults(
  defineProps<{
    categories: ServiceCategory[]
    variant?: 'large' | 'compact'
  }>(),
  { variant: 'large' },
)

const emit = defineEmits<{
  submit: [{ category: string, location: string }]
}>()

const category = defineModel<string>('category', { default: '' })
const location = defineModel<string>('location', { default: '' })

const { t } = useI18n()

// Unique per instance — this component renders more than once at a time (the
// hero search and the header's docked copy both exist in the DOM together),
// so a fixed id would duplicate and break the label association.
const uid = useId()

function handleSubmit() {
  emit('submit', { category: category.value, location: location.value })
}
</script>

<template>
  <form
    class="flex items-center gap-1 rounded-full border border-black/10 bg-white/70 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/40"
    :class="variant === 'large' ? 'p-2' : 'p-1'"
    @submit.prevent="handleSubmit"
  >
    <label
      :for="`${uid}-category`"
      class="flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5 min-w-0"
    >
      <span class="sr-only">{{ t('marketplace.search.categoryLabel') }}</span>
      <UiIcon
        name="search"
        :size="16"
        class="shrink-0 text-black/40 dark:text-white/40"
      />
      <select
        :id="`${uid}-category`"
        v-model="category"
        class="w-full truncate bg-transparent text-sm text-black outline-none dark:text-white"
      >
        <option value="">
          {{ t('marketplace.search.categoryPlaceholder') }}
        </option>
        <option
          v-for="cat in categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ t(`marketplace.categories.${cat.id}.label`) }}
        </option>
      </select>
    </label>

    <div class="h-6 w-px shrink-0 bg-black/10 dark:bg-white/10" />

    <label
      :for="`${uid}-location`"
      class="flex flex-1 items-center gap-2.5 rounded-full px-4 py-2.5 min-w-0"
    >
      <span class="sr-only">{{ t('marketplace.search.locationLabel') }}</span>
      <UiIcon
        name="map-pin"
        :size="16"
        class="shrink-0 text-black/40 dark:text-white/40"
      />
      <input
        :id="`${uid}-location`"
        v-model="location"
        type="text"
        :placeholder="t('marketplace.search.locationPlaceholder')"
        class="w-full truncate bg-transparent text-sm text-black outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/40"
      >
    </label>

    <UiButton
      type="submit"
      class="rounded-full!"
      :class="variant === 'compact' ? 'px-4! py-2! text-xs!' : ''"
    >
      <UiIcon
        name="search"
        :size="14"
      />
      {{ t('marketplace.search.submit') }}
    </UiButton>
  </form>
</template>
