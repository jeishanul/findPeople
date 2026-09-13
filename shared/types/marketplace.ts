/**
 * Display copy for all of these lives in i18n messages, keyed by the ids here
 * (e.g. `marketplace.categories.${category.id}.label`) — see Internationalization
 * in CLAUDE.md. Only genuine proper nouns (`name`, `reviewerName`) are plain strings.
 */

export interface ServiceCategory {
  id: string
  icon: string
  providerCount: number
}

export interface Review {
  id: string
  reviewerName: string
  rating: number
  postedDaysAgo: number
}

export interface ProviderSummary {
  id: string
  name: string
  categoryId: string
  skillIds: string[]
  rating: number
  reviewCount: number
  ratePerHour: number
  distanceKm: number
  verified: boolean
}

export interface ProviderProfile extends ProviderSummary {
  yearsExperience: number
  jobsCompleted: number
  repeatClientPercent: number
  responseTimeHours: number
  minVisitFee: number
  serviceAreaKm: number
  reviews: Review[]
}

export interface Testimonial {
  id: string
  reviewerName: string
  rating: number
}

export interface FaqItem {
  id: string
}

export type GalleryTab = 'home' | 'recommended' | 'trending'

export interface GalleryItem {
  categoryId: string
}

export interface ProviderQuery {
  category?: string
  minRating?: number
  verifiedOnly?: boolean
  minRate?: number
  maxRate?: number
  page?: number
  perPage?: number
}

export interface PagedResult<T> {
  items: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}
