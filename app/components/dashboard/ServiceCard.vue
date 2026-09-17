<script setup lang="ts">
import type { ServiceListing } from '#shared/types/dashboard'

// Auto-imported as <DashboardServiceCard/>. One listing on the "My services"
// page, with a working active/paused toggle.
const props = defineProps<{
  service: ServiceListing
}>()

defineEmits<{
  'toggle-status': [id: string]
}>()

const { t } = useI18n()

const isPaused = computed(() => props.service.status === 'paused')
</script>

<template>
  <div
    class="flex flex-col gap-3.5 rounded-2xl border border-black/10 p-6 dark:border-white/10"
    :class="isPaused && 'opacity-70'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex gap-3.5">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          :class="isPaused
            ? 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
            : 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100'"
        >
          <UiIcon
            name="briefcase"
            :size="20"
          />
        </span>
        <div>
          <div class="text-[15.5px] font-bold">
            {{ service.title }}
          </div>
          <div class="mt-0.5 text-xs text-black/60 dark:text-white/60">
            {{ t(`marketplace.categories.${service.categoryId}.label`) }} · {{ service.durationLabel }}
          </div>
        </div>
      </div>
      <button
        type="button"
        class="shrink-0"
        @click="$emit('toggle-status', service.id)"
      >
        <UiTag :variant="isPaused ? 'neutral' : 'primary'">
          {{ isPaused ? t('dashboard.services.statusPaused') : t('dashboard.services.statusActive') }}
        </UiTag>
      </button>
    </div>

    <p class="text-[13px] leading-relaxed text-black/60 dark:text-white/60">
      {{ service.description }}
    </p>

    <div class="flex items-center gap-4 border-t border-black/10 pt-3 text-[12.5px] text-black/60 dark:border-white/10 dark:text-white/60">
      <span class="font-bold text-black dark:text-white">{{ service.priceLabel }}</span>
      <span>{{ t('dashboard.services.bookingsCount', { count: service.bookingsCount }) }}</span>
      <span class="flex items-center gap-1">
        <UiIcon
          name="star"
          filled
          :size="13"
          class="text-accent-600"
        />
        {{ service.rating.toFixed(1) }}
      </span>
    </div>

    <div class="flex gap-2">
      <UiButton
        variant="ghost"
        size="sm"
        class="flex-1"
      >
        {{ t('dashboard.services.edit') }}
      </UiButton>
      <UiButton
        variant="ghost"
        size="sm"
        class="flex-1"
        @click="isPaused && $emit('toggle-status', service.id)"
      >
        {{ isPaused ? t('dashboard.services.resume') : t('dashboard.services.preview') }}
      </UiButton>
    </div>
  </div>
</template>
