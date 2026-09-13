<script setup lang="ts">
import type { PagedResult, ProviderProfile, ServiceCategory } from '#shared/types/marketplace'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const { data: categories } = await useApi<ServiceCategory[]>('/categories')

const filters = reactive({
  category: typeof route.query.category === 'string' ? route.query.category : '',
  location: typeof route.query.location === 'string' ? route.query.location : '',
  minRating: route.query.minRating ? Number(route.query.minRating) : 0,
  verifiedOnly: route.query.verifiedOnly === 'true',
  minPrice: route.query.minPrice ? Number(route.query.minPrice) : PRICE_MIN,
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : PRICE_MAX,
  page: route.query.page ? Number(route.query.page) : 1,
})

const activeCategory = computed<ServiceCategory | null>(
  () => categories.value?.find(category => category.id === filters.category) ?? null,
)

const providerQuery = computed(() => ({
  category: filters.category || undefined,
  minRating: filters.minRating || undefined,
  verifiedOnly: filters.verifiedOnly || undefined,
  minRate: filters.minPrice > PRICE_MIN ? filters.minPrice : undefined,
  maxRate: filters.maxPrice < PRICE_MAX ? filters.maxPrice : undefined,
  page: filters.page,
  perPage: 6,
}))

const { data: providersPage } = await useApi<PagedResult<ProviderProfile>>('/providers', {
  query: providerQuery,
  key: 'browse-providers',
})

function syncUrl() {
  navigateTo(localePath({
    path: '/browse',
    query: {
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.location ? { location: filters.location } : {}),
      ...(filters.minRating ? { minRating: String(filters.minRating) } : {}),
      ...(filters.verifiedOnly ? { verifiedOnly: 'true' } : {}),
      ...(filters.minPrice > PRICE_MIN ? { minPrice: String(filters.minPrice) } : {}),
      ...(filters.maxPrice < PRICE_MAX ? { maxPrice: String(filters.maxPrice) } : {}),
      ...(filters.page > 1 ? { page: String(filters.page) } : {}),
    },
  }), { replace: true })
}

function applyFilters() {
  filters.page = 1
  syncUrl()
}

function clearCategory() {
  filters.category = ''
  filters.page = 1
  syncUrl()
}

function goToPage(page: number) {
  filters.page = page
  syncUrl()
}

const heroSearchCategory = ref(filters.category)
const heroSearchLocation = ref(filters.location)
function handleTopSearch() {
  filters.category = heroSearchCategory.value
  filters.location = heroSearchLocation.value
  filters.page = 1
  syncUrl()
}

const pageTitle = computed(() => activeCategory.value
  ? t('marketplace.browse.titleWithCategory', {
      count: providersPage.value?.total ?? 0,
      category: t(`marketplace.categories.${activeCategory.value.id}.label`),
      location: filters.location || t('marketplace.browse.anywhere'),
    })
  : t('marketplace.browse.titleAll', {
      count: providersPage.value?.total ?? 0,
      location: filters.location || t('marketplace.browse.anywhere'),
    }))

useSeoMeta({
  title: pageTitle,
  description: t('marketplace.browse.seoDescription'),
})
defineOgImage('MarketplaceSatori', {
  title: pageTitle,
  eyebrow: t('marketplace.browse.seoEyebrow'),
})
useSchemaOrg([defineWebPage()])
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
    <div class="mb-7">
      <MarketplaceServiceSearchBar
        v-model:category="heroSearchCategory"
        v-model:location="heroSearchLocation"
        variant="compact"
        :categories="categories ?? []"
        class="max-w-2xl"
        @submit="handleTopSearch"
      />
    </div>

    <h1 class="font-display text-2xl font-bold sm:text-3xl">
      {{ pageTitle }}
    </h1>

    <div class="mt-8 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
      <!-- This wrapper is the grid cell and stretches to the row's full
           height (matching the results column); the sidebar itself is the
           `sticky` element inside it, so it has room to travel and pin all
           the way down a tall results list instead of stopping early. -->
      <div>
        <MarketplaceProviderFilterSidebar
          v-model:location="filters.location"
          v-model:min-rating="filters.minRating"
          v-model:verified-only="filters.verifiedOnly"
          v-model:min-price="filters.minPrice"
          v-model:max-price="filters.maxPrice"
          :category="activeCategory"
          class="sticky top-28"
          @apply="applyFilters"
          @clear-category="clearCategory"
        />
      </div>

      <div class="flex flex-col gap-4">
        <template v-if="providersPage && providersPage.items.length">
          <MarketplaceProviderCard
            v-for="provider in providersPage.items"
            :key="provider.id"
            :provider="provider"
            :category-icon="getCategoryIcon(categories ?? [], provider.categoryId)"
            variant="row"
          />
        </template>
        <p
          v-else
          class="rounded-2xl border border-black/10 bg-white/70 p-8 text-center text-black/60 dark:border-white/10 dark:bg-black/30 dark:text-white/60"
        >
          {{ t('marketplace.browse.noResults') }}
        </p>

        <div
          v-if="providersPage && providersPage.totalPages > 1"
          class="mt-2 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 dark:border-white/10"
            :disabled="filters.page <= 1"
            :aria-label="t('marketplace.browse.previousPage')"
            @click="goToPage(filters.page - 1)"
          >
            <UiIcon
              name="arrow-right"
              class="rotate-180"
              :size="15"
            />
          </button>
          <span class="px-3 text-sm text-black/60 dark:text-white/60">
            {{ t('marketplace.browse.pageOf', { page: providersPage.page, totalPages: providersPage.totalPages }) }}
          </span>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 disabled:opacity-40 dark:border-white/10"
            :disabled="filters.page >= providersPage.totalPages"
            :aria-label="t('marketplace.browse.nextPage')"
            @click="goToPage(filters.page + 1)"
          >
            <UiIcon
              name="arrow-right"
              :size="15"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
