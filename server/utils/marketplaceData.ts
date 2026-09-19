import { slugify } from '#shared/utils/slugify'
import type {
  FaqItem,
  GalleryItem,
  GalleryTab,
  PagedResult,
  ProviderProfile,
  ProviderQuery,
  ServiceCategory,
  Testimonial,
} from '#shared/types/marketplace'

/**
 * In-memory mock data standing in for a real database. Every route handler in
 * `server/api/` reads through the functions below instead of holding its own
 * copy, so there is exactly one place that knows the shape of this content.
 */

const CATEGORIES: ServiceCategory[] = [
  { id: 'cleaning', icon: 'broom', providerCount: 1400 },
  { id: 'ac-service', icon: 'snowflake', providerCount: 980 },
  { id: 'electrician', icon: 'bolt', providerCount: 1150 },
  { id: 'plumber', icon: 'wrench', providerCount: 890 },
  { id: 'painter', icon: 'roller', providerCount: 620 },
  { id: 'carpenter', icon: 'hammer', providerCount: 540 },
  { id: 'appliance-repair', icon: 'gear', providerCount: 410 },
  { id: 'gardening', icon: 'leaf', providerCount: 360 },
]

interface ProviderSeed {
  name: string
  categoryId: string
  skillIds: string[]
  rating: number
  reviewCount: number
  ratePerHour: number
  verified: boolean
  yearsExperience: number
  jobsCompleted: number
  repeatClientPercent: number
  responseTimeHours: number
  minVisitFee: number
  serviceAreaKm: number
  availableDays: string[]
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  barangay: string
  reviews: Array<{ reviewerName: string, rating: number, postedDaysAgo: number }>
}

const PROVIDER_SEEDS: ProviderSeed[] = [
  {
    name: 'Rahim Karim',
    categoryId: 'electrician',
    skillIds: ['wiring', 'fault-fixing', 'panel-upgrades'],
    rating: 4.9,
    reviewCount: 212,
    ratePerHour: 18,
    verified: true,
    yearsExperience: 8,
    jobsCompleted: 340,
    repeatClientPercent: 76,
    responseTimeHours: 1,
    minVisitFee: 40,
    serviceAreaKm: 6,
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    provinceCode: '1374',
    provinceName: 'NCR, Second District',
    cityCode: '137404',
    cityName: 'Quezon City',
    barangay: 'Aurora',
    reviews: [
      { reviewerName: 'Tanvir R.', rating: 5, postedDaysAgo: 14 },
      { reviewerName: 'Farzana H.', rating: 4, postedDaysAgo: 30 },
    ],
  },
  {
    name: 'Anika Sultana',
    categoryId: 'cleaning',
    skillIds: ['deep-clean', 'move-out-clean'],
    rating: 5,
    reviewCount: 348,
    ratePerHour: 15,
    verified: true,
    yearsExperience: 5,
    jobsCompleted: 512,
    repeatClientPercent: 82,
    responseTimeHours: 1,
    minVisitFee: 25,
    serviceAreaKm: 5,
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    provinceCode: '1376',
    provinceName: 'NCR, Fourth District',
    cityCode: '137602',
    cityName: 'City of Makati',
    barangay: 'Bel-Air',
    reviews: [
      { reviewerName: 'Nadia S.', rating: 5, postedDaysAgo: 5 },
      { reviewerName: 'Imran K.', rating: 5, postedDaysAgo: 21 },
    ],
  },
  {
    name: 'Farhan Ahmed',
    categoryId: 'plumber',
    skillIds: ['leak-repair', 'fittings'],
    rating: 4.8,
    reviewCount: 156,
    ratePerHour: 20,
    verified: true,
    yearsExperience: 6,
    jobsCompleted: 260,
    repeatClientPercent: 64,
    responseTimeHours: 2,
    minVisitFee: 35,
    serviceAreaKm: 7,
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    provinceCode: '1374',
    provinceName: 'NCR, Second District',
    cityCode: '137403',
    cityName: 'City of Pasig',
    barangay: 'Bagong Ilog',
    reviews: [
      { reviewerName: 'Shafiq M.', rating: 5, postedDaysAgo: 9 },
      { reviewerName: 'Tanvir R.', rating: 4, postedDaysAgo: 40 },
    ],
  },
  {
    name: 'Mim Tabassum',
    categoryId: 'painter',
    skillIds: ['interior-painting', 'texture-finish'],
    rating: 4.9,
    reviewCount: 97,
    ratePerHour: 17,
    verified: true,
    yearsExperience: 4,
    jobsCompleted: 140,
    repeatClientPercent: 58,
    responseTimeHours: 3,
    minVisitFee: 30,
    serviceAreaKm: 8,
    availableDays: ['tue', 'wed', 'thu', 'fri', 'sat'],
    provinceCode: '1376',
    provinceName: 'NCR, Fourth District',
    cityCode: '137607',
    cityName: 'Taguig City',
    barangay: 'Central Bicutan',
    reviews: [
      { reviewerName: 'Nadia S.', rating: 5, postedDaysAgo: 18 },
    ],
  },
  {
    name: 'Karim Hossain',
    categoryId: 'carpenter',
    skillIds: ['furniture-repair', 'custom-fittings'],
    rating: 4.7,
    reviewCount: 124,
    ratePerHour: 19,
    verified: true,
    yearsExperience: 7,
    jobsCompleted: 205,
    repeatClientPercent: 61,
    responseTimeHours: 2,
    minVisitFee: 30,
    serviceAreaKm: 6,
    availableDays: ['mon', 'wed', 'fri', 'sat'],
    provinceCode: '1374',
    provinceName: 'NCR, Second District',
    cityCode: '137401',
    cityName: 'City of Mandaluyong',
    barangay: 'Addition Hills',
    reviews: [
      { reviewerName: 'Imran K.', rating: 4, postedDaysAgo: 12 },
    ],
  },
  {
    name: 'Nusrat Jahan',
    categoryId: 'ac-service',
    skillIds: ['ac-servicing', 'ac-installation'],
    rating: 4.9,
    reviewCount: 201,
    ratePerHour: 22,
    verified: true,
    yearsExperience: 6,
    jobsCompleted: 330,
    repeatClientPercent: 70,
    responseTimeHours: 1,
    minVisitFee: 40,
    serviceAreaKm: 6,
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    provinceCode: '1376',
    provinceName: 'NCR, Fourth District',
    cityCode: '137605',
    cityName: 'Pasay City',
    barangay: 'Barangay 105',
    reviews: [
      { reviewerName: 'Shafiq M.', rating: 5, postedDaysAgo: 3 },
    ],
  },
  {
    name: 'Emon Rahman',
    categoryId: 'appliance-repair',
    skillIds: ['fridge-repair', 'washer-repair'],
    rating: 4.6,
    reviewCount: 58,
    ratePerHour: 16,
    verified: true,
    yearsExperience: 3,
    jobsCompleted: 90,
    repeatClientPercent: 47,
    responseTimeHours: 4,
    minVisitFee: 25,
    serviceAreaKm: 5,
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    provinceCode: '1376',
    provinceName: 'NCR, Fourth District',
    cityCode: '137603',
    cityName: 'City of Muntinlupa',
    barangay: 'Alabang',
    reviews: [
      { reviewerName: 'Farzana H.', rating: 4, postedDaysAgo: 25 },
    ],
  },
  {
    name: 'Priya Das',
    categoryId: 'gardening',
    skillIds: ['landscaping', 'garden-upkeep'],
    rating: 5,
    reviewCount: 77,
    ratePerHour: 14,
    verified: true,
    yearsExperience: 4,
    jobsCompleted: 120,
    repeatClientPercent: 55,
    responseTimeHours: 3,
    minVisitFee: 20,
    serviceAreaKm: 5,
    availableDays: ['mon', 'tue', 'thu', 'fri', 'sat'],
    provinceCode: '1374',
    provinceName: 'NCR, Second District',
    cityCode: '137402',
    cityName: 'City of Marikina',
    barangay: 'Concepcion Uno',
    reviews: [
      { reviewerName: 'Nadia S.', rating: 5, postedDaysAgo: 8 },
    ],
  },
]

const PROVIDERS: ProviderProfile[] = PROVIDER_SEEDS.map(seed => ({
  id: slugify(seed.name),
  name: seed.name,
  categoryId: seed.categoryId,
  skillIds: seed.skillIds,
  rating: seed.rating,
  reviewCount: seed.reviewCount,
  ratePerHour: seed.ratePerHour,
  verified: seed.verified,
  yearsExperience: seed.yearsExperience,
  jobsCompleted: seed.jobsCompleted,
  repeatClientPercent: seed.repeatClientPercent,
  responseTimeHours: seed.responseTimeHours,
  minVisitFee: seed.minVisitFee,
  serviceAreaKm: seed.serviceAreaKm,
  availableDays: seed.availableDays,
  provinceCode: seed.provinceCode,
  provinceName: seed.provinceName,
  cityCode: seed.cityCode,
  cityName: seed.cityName,
  barangay: seed.barangay,
  reviews: seed.reviews.map((review, index) => ({
    id: `${slugify(seed.name)}-review-${index + 1}`,
    ...review,
  })),
}))

const TESTIMONIALS: Testimonial[] = [
  { id: 'tanvir-r', reviewerName: 'Tanvir R.', rating: 5 },
  { id: 'farzana-h', reviewerName: 'Farzana H.', rating: 5 },
  { id: 'imran-k', reviewerName: 'Imran K.', rating: 4 },
  { id: 'nadia-s', reviewerName: 'Nadia S.', rating: 5 },
  { id: 'shafiq-m', reviewerName: 'Shafiq M.', rating: 4 },
]

const FAQ_IDS = [
  'trust',
  'cost',
  'coverage-area',
  'unhappy',
  'payments',
  'recurring',
  'mobile-app',
]

const GALLERY_TABS: Record<GalleryTab, string[]> = {
  home: ['cleaning', 'plumber', 'ac-service', 'appliance-repair', 'painter', 'carpenter'],
  recommended: ['electrician', 'ac-service', 'gardening', 'cleaning', 'appliance-repair', 'painter'],
  trending: ['ac-service', 'cleaning', 'electrician', 'plumber', 'gardening', 'carpenter'],
}

export function getCategories(): ServiceCategory[] {
  return CATEGORIES
}

export function getCategoryById(id: string): ServiceCategory | undefined {
  return CATEGORIES.find(category => category.id === id)
}

export function getProviders(query: ProviderQuery = {}): PagedResult<ProviderProfile> {
  const page = query.page && query.page > 0 ? query.page : 1
  const perPage = query.perPage && query.perPage > 0 ? query.perPage : 8

  const filtered = PROVIDERS.filter((provider) => {
    if (query.categories && query.categories.length > 0 && !query.categories.includes(provider.categoryId)) return false
    if (query.minRating && provider.rating < query.minRating) return false
    if (query.verifiedOnly && !provider.verified) return false
    if (query.minRate !== undefined && provider.ratePerHour < query.minRate) return false
    if (query.maxRate !== undefined && provider.ratePerHour > query.maxRate) return false
    // Per the client spec doc: service-only matches nationwide; +province
    // narrows to that province; +province+city narrows further. `barangay`
    // narrows one level further still when given.
    if (query.province && provider.provinceCode !== query.province) return false
    if (query.city && provider.cityCode !== query.city) return false
    if (query.barangay && provider.barangay !== query.barangay) return false
    return true
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage

  return {
    items: filtered.slice(start, start + perPage),
    page,
    perPage,
    total,
    totalPages,
  }
}

export function getProviderById(id: string): ProviderProfile | undefined {
  return PROVIDERS.find(provider => provider.id === id)
}

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS
}

export function getFaqItems(): FaqItem[] {
  return FAQ_IDS.map(id => ({ id }))
}

export function getGalleryItems(tab: GalleryTab): GalleryItem[] {
  const categoryIds = GALLERY_TABS[tab] ?? GALLERY_TABS.home
  return categoryIds.map(categoryId => ({ categoryId }))
}
