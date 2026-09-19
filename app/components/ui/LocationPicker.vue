<script setup lang="ts">
// Auto-imported as <UiLocationPicker />. Replaces the free-text "your
// location" field with the Philippines Province -> City/Municipality ->
// Barangay cascade the client's spec doc calls for, backed by the real
// vendored dataset served through `/api/locations/*` (see
// `server/utils/phLocations.ts`) — a single compact trigger + popover
// (built the same combobox-button pattern as `UiSelectSearch`) rather than
// three permanently-visible dropdowns, so it drops into the existing search
// bar/filters layout without changing their shape.
interface LocationOption {
  code: string
  name: string
}

withDefaults(
  defineProps<{
    id?: string
    placeholder?: string
    variant?: 'default' | 'bare'
  }>(),
  {
    id: undefined,
    placeholder: undefined,
    variant: 'default',
  },
)

const { t } = useI18n()

const provinceCode = defineModel<string | null>('province', { default: null })
const cityCode = defineModel<string | null>('city', { default: null })
const barangay = defineModel<string | null>('barangay', { default: null })

const isOpen = ref(false)
const rootRef = useTemplateRef('rootRef')

// The provinces list never varies by instance/query, so it's safe (and
// desirable) to share one cached fetch across every picker on the page —
// but cities/barangays depend on THIS picker's own province/city selection,
// so each instance needs its own key or two pickers on the same page (e.g.
// the search bar's and the filter sidebar's) would stomp on each other's
// cached results.
const uid = useId()

const { data: provinces } = useApi<LocationOption[]>('/locations/provinces', {
  key: 'ph-provinces',
  default: () => [],
})
const { data: cities } = useApi<LocationOption[]>('/locations/cities', {
  key: `ph-cities-${uid}`,
  query: computed(() => ({ province: provinceCode.value ?? undefined })),
  default: () => [],
})
const { data: barangays } = useApi<{ name: string }[]>('/locations/barangays', {
  key: `ph-barangays-${uid}`,
  query: computed(() => ({ city: cityCode.value ?? undefined })),
  default: () => [],
})

const provinceOptions = computed(() => (provinces.value ?? []).map(p => ({ value: p.code, label: p.name })))
const cityOptions = computed(() => (cities.value ?? []).map(c => ({ value: c.code, label: c.name })))
const barangayOptions = computed(() => (barangays.value ?? []).map(b => ({ value: b.name, label: b.name })))

// Cascading clear: picking a new province invalidates any city/barangay
// chosen under the previous one.
watch(provinceCode, () => {
  cityCode.value = null
  barangay.value = null
})
watch(cityCode, () => {
  barangay.value = null
})

const provinceName = computed(() => provinces.value?.find(p => p.code === provinceCode.value)?.name ?? null)
const cityName = computed(() => cities.value?.find(c => c.code === cityCode.value)?.name ?? null)

const summary = computed(() => {
  const parts = [provinceName.value, cityName.value, barangay.value].filter((part): part is string => !!part)
  return parts.length > 0 ? parts.join(', ') : null
})

function clearAll() {
  provinceCode.value = null
  cityCode.value = null
  barangay.value = null
}

onClickOutside(rootRef, () => (isOpen.value = false))
</script>

<template>
  <div
    ref="rootRef"
    class="relative"
  >
    <button
      :id="id"
      type="button"
      class="flex w-full items-center gap-2.5 text-left text-sm outline-none"
      :class="variant === 'bare'
        ? ''
        : 'rounded-xl border border-black/10 bg-white px-4 py-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5'"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <UiIcon
        name="map-pin"
        :size="16"
        class="shrink-0 text-black/40 dark:text-white/40"
      />
      <span
        class="min-w-0 flex-1 truncate"
        :class="summary ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40'"
      >{{ summary ?? (placeholder ?? t('marketplace.search.locationPlaceholder')) }}</span>
      <UiIcon
        name="chevron-down"
        :size="16"
        class="shrink-0 text-black/40 transition-transform dark:text-white/40"
        :class="isOpen && 'rotate-180'"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-20 mt-1.5 w-full rounded-xl border border-black/10 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-black"
    >
      <div class="flex flex-col gap-3">
        <div>
          <label
            :for="`${id}-province`"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('marketplace.search.provinceLabel') }}</label>
          <UiSelectSearch
            :id="`${id}-province`"
            v-model="provinceCode"
            :options="provinceOptions"
            :placeholder="t('marketplace.search.provincePlaceholder')"
          />
        </div>
        <div>
          <label
            :for="`${id}-city`"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('marketplace.search.cityLabel') }}</label>
          <UiSelectSearch
            :id="`${id}-city`"
            v-model="cityCode"
            :options="cityOptions"
            :disabled="!provinceCode"
            :placeholder="t('marketplace.search.cityPlaceholder')"
          />
        </div>
        <div>
          <label
            :for="`${id}-barangay`"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('marketplace.search.barangayLabel') }}</label>
          <UiSelectSearch
            :id="`${id}-barangay`"
            v-model="barangay"
            :options="barangayOptions"
            :disabled="!cityCode"
            :placeholder="t('marketplace.search.barangayPlaceholder')"
          />
        </div>
        <UiButton
          v-if="summary"
          variant="ghost"
          size="sm"
          @click="clearAll"
        >
          {{ t('marketplace.search.clearLocation') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
