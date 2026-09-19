<script setup lang="ts">
// Auto-imported as <UiSelectSearch />. A searchable, accessible dropdown
// select — the one reusable picker for every select-like control in the
// app (see CLAUDE.md's reuse contract: this replaces the native <select> in
// MarketplaceServiceSearchBar and backs every new dropdown this batch adds,
// e.g. the Province/City/Barangay location pickers and the service-category
// picker). Combobox-button + listbox pattern, not a native <select>, so it
// can offer type-to-filter on large option lists (e.g. 1,600+ PH cities).
export interface SelectSearchOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    id?: string
    options: SelectSearchOption[]
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
    /** `bare` drops the trigger's own border/background/padding so it can sit
     * seamlessly inside another bordered control (e.g. a pill-shaped search
     * bar with several fields) instead of looking like a nested input. */
    variant?: 'default' | 'bare'
  }>(),
  {
    id: undefined,
    placeholder: undefined,
    searchPlaceholder: undefined,
    disabled: false,
    variant: 'default',
  },
)

const { t } = useI18n()

const model = defineModel<string | null>({ default: null })

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const rootRef = useTemplateRef('rootRef')
const searchInputRef = useTemplateRef('searchInputRef')

const selectedOption = computed(() => props.options.find(option => option.value === model.value) ?? null)

const filteredOptions = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return props.options
  return props.options.filter(option => option.label.toLowerCase().includes(needle))
})

function open() {
  if (props.disabled) return
  isOpen.value = true
  query.value = ''
  activeIndex.value = filteredOptions.value.findIndex(option => option.value === model.value)
  nextTick(() => searchInputRef.value?.focus())
}

function close() {
  isOpen.value = false
  activeIndex.value = -1
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function select(option: SelectSearchOption) {
  model.value = option.value
  close()
}

function clear() {
  model.value = null
  close()
}

function moveActive(delta: number) {
  if (filteredOptions.value.length === 0) return
  const next = activeIndex.value + delta
  activeIndex.value = Math.max(0, Math.min(filteredOptions.value.length - 1, next))
}

function chooseActive() {
  const option = filteredOptions.value[activeIndex.value]
  if (option) select(option)
}

watch(filteredOptions, () => {
  activeIndex.value = filteredOptions.value.length > 0 ? 0 : -1
})

onClickOutside(rootRef, close)
</script>

<template>
  <div
    ref="rootRef"
    class="relative"
  >
    <button
      :id="id"
      type="button"
      :disabled="disabled"
      class="flex w-full items-center gap-2.5 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
      :class="variant === 'bare'
        ? ''
        : 'rounded-xl border border-black/10 bg-white px-4 py-3 focus-within:border-brand-500 dark:border-white/10 dark:bg-white/5'"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown.down.prevent="open"
      @keydown.up.prevent="open"
    >
      <span
        class="min-w-0 flex-1 truncate"
        :class="selectedOption ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40'"
      >{{ selectedOption?.label ?? placeholder }}</span>
      <UiIcon
        v-if="selectedOption"
        name="x"
        :size="14"
        class="shrink-0 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
        @click.stop="clear"
      />
      <UiIcon
        name="chevron-down"
        :size="16"
        class="shrink-0 text-black/40 transition-transform dark:text-white/40"
        :class="isOpen && 'rotate-180'"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-black"
    >
      <div class="border-b border-black/10 p-2 dark:border-white/10">
        <div class="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 dark:bg-white/10">
          <UiIcon
            name="search"
            :size="14"
            class="shrink-0 text-black/40 dark:text-white/40"
          />
          <input
            ref="searchInputRef"
            v-model="query"
            type="text"
            :aria-label="searchPlaceholder ?? t('ui.selectSearch.searchPlaceholder')"
            :aria-activedescendant="activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined"
            :placeholder="searchPlaceholder ?? t('ui.selectSearch.searchPlaceholder')"
            class="w-full bg-transparent text-sm outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
            @keydown.down.prevent="moveActive(1)"
            @keydown.up.prevent="moveActive(-1)"
            @keydown.enter.prevent="chooseActive"
            @keydown.escape.prevent="close"
          >
        </div>
      </div>
      <ul
        role="listbox"
        class="max-h-56 overflow-y-auto p-1.5"
      >
        <!-- Keyboard nav lives on the search input above (aria-activedescendant
             pattern) — options are visually highlighted, not individually
             focused, matching the standard combobox/listbox a11y pattern. -->
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/interactive-supports-focus, vuejs-accessibility/mouse-events-have-key-events -->
        <li
          v-for="(option, index) in filteredOptions"
          :id="`${id}-option-${index}`"
          :key="option.value"
          role="option"
          :aria-selected="option.value === model"
          class="cursor-pointer rounded-lg px-3 py-2 text-sm"
          :class="[
            option.value === model ? 'font-bold text-brand-700 dark:text-brand-100' : 'text-black dark:text-white',
            index === activeIndex ? 'bg-brand-50 dark:bg-brand-700/20' : 'hover:bg-black/5 dark:hover:bg-white/10',
          ]"
          @mouseenter="activeIndex = index"
          @click="select(option)"
        >
          {{ option.label }}
        </li>
        <li
          v-if="filteredOptions.length === 0"
          class="px-3 py-2 text-sm text-black/40 dark:text-white/40"
        >
          {{ t('ui.selectSearch.noResults') }}
        </li>
      </ul>
    </div>
  </div>
</template>
