<script setup lang="ts">
import type {
  FaqItem,
  GalleryItem,
  GalleryTab,
  PagedResult,
  ProviderProfile,
  ServiceCategory,
  Testimonial,
} from '#shared/types/marketplace'

const { t } = useI18n()
const localePath = useLocalePath()

const { data: categories } = await useApi<ServiceCategory[]>('/categories')
const { data: providersPage } = await useApi<PagedResult<ProviderProfile>>('/providers', {
  query: { perPage: 8 },
})
const { data: testimonials } = await useApi<Testimonial[]>('/testimonials')
const { data: faqItems } = await useApi<FaqItem[]>('/faq')

const GALLERY_TABS: GalleryTab[] = ['home', 'recommended', 'trending']
const galleryResponses = await Promise.all(
  GALLERY_TABS.map(tab => useApi<GalleryItem[]>('/gallery', { query: { tab }, key: `home-gallery-${tab}` })),
)
const galleryItemsByTab = computed(() => Object.fromEntries(
  GALLERY_TABS.map((tab, index) => [tab, galleryResponses[index]?.data.value ?? []]),
) as Record<GalleryTab, GalleryItem[]>)

function handleHeroSearch({ category, province, city, barangay }: { category: string, province: string, city: string, barangay: string }) {
  navigateTo(localePath({
    path: '/browse',
    query: {
      ...(category ? { categories: category } : {}),
      ...(province ? { province } : {}),
      ...(city ? { city } : {}),
      ...(barangay ? { barangay } : {}),
    },
  }))
}

useSeoMeta({
  title: t('home.seoTitle'),
  description: t('home.seoDescription'),
})
defineOgImage('DefaultSatori', {
  title: t('home.seoTitle'),
  description: t('home.seoDescription'),
})
useSchemaOrg([defineWebPage()])
</script>

<template>
  <div>
    <MarketplaceHeroSlider
      :categories="categories ?? []"
      @search="handleHeroSearch"
    />
    <MarketplaceTrustStats />
    <MarketplaceHowItWorksSteps />
    <MarketplaceCategoryCarousel :categories="categories ?? []" />
    <MarketplaceFeaturedProviders
      :providers="providersPage?.items ?? []"
      :categories="categories ?? []"
    />
    <MarketplaceWhyChooseUs />
    <MarketplaceJobsGallery
      :items-by-tab="galleryItemsByTab"
      :categories="categories ?? []"
    />
    <MarketplaceTestimonialSlider :testimonials="testimonials ?? []" />
    <MarketplaceDownloadAppSection />
    <MarketplaceFaqAccordion :items="faqItems ?? []" />
    <MarketplaceScrollHintArrow />
  </div>
</template>
