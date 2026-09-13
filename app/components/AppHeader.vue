<script setup lang="ts">
import type { ServiceCategory } from '#shared/types/marketplace'

// Nav labels come from i18n messages, not hardcoded strings.
const { t } = useI18n()

const links = computed(() => [
  { label: t('nav.howItWorks'), to: '/#how-it-works' },
  { label: t('nav.browseServices'), to: '/browse' },
])

// Only the home page's hero ever docks its search bar into the header (see
// `useHeroSearchDock`); guard on the route so a stale flag from a previous
// visit never shows the compact search on another page.
const route = useRoute()
const isHomeRoute = computed(() => String(route.name ?? '').startsWith('index'))
const { isDocked } = useHeroSearchDock()
const showDockedSearch = computed(() => isHomeRoute.value && isDocked.value)

const { data: categories } = await useApi<ServiceCategory[]>('/categories', { lazy: true, default: () => [] })

const localePath = useLocalePath()
function handleDockedSearch({ category, location }: { category: string, location: string }) {
  navigateTo(localePath({
    path: '/browse',
    query: {
      ...(category ? { category } : {}),
      ...(location ? { location } : {}),
    },
  }))
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
    <nav class="relative mx-auto flex h-[84px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
      <NuxtLinkLocale
        to="/"
        class="flex shrink-0 items-center gap-2.5 font-display font-bold text-brand-700 dark:text-brand-500"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <UiIcon
            name="leaf"
            :size="22"
          />
        </span>
        <span class="text-xl">{{ t('brand.name') }}</span>
      </NuxtLinkLocale>

      <ul
        class="hidden items-center gap-9 text-sm font-semibold transition-opacity duration-300 md:flex"
        :class="showDockedSearch ? 'pointer-events-none absolute opacity-0' : 'opacity-100'"
      >
        <li
          v-for="link in links"
          :key="link.to"
        >
          <NuxtLinkLocale
            :to="link.to"
            class="hover:text-brand-700"
          >
            {{ link.label }}
          </NuxtLinkLocale>
        </li>
      </ul>

      <div
        class="absolute left-1/2 hidden max-w-md flex-1 -translate-x-1/2 transition-all duration-300 md:flex"
        :class="showDockedSearch ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1.5 opacity-0'"
      >
        <MarketplaceServiceSearchBar
          variant="compact"
          :categories="categories ?? []"
          class="w-full"
          @submit="handleDockedSearch"
        />
      </div>

      <div class="flex shrink-0 items-center gap-3.5">
        <UiThemeToggle />
        <div class="flex items-center gap-2.5">
          <UiButton variant="ghost">
            {{ t('nav.login') }}
          </UiButton>
          <UiButton variant="primary">
            {{ t('nav.signup') }}
          </UiButton>
        </div>
        <UiLocaleSwitcher />
      </div>
    </nav>
  </header>
</template>
