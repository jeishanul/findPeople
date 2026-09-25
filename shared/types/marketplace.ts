/**
 * Display copy for all of these lives in i18n messages, keyed by the ids here
 * (e.g. `marketplace.categories.${category.id}.label`) — see Internationalization
 * in CLAUDE.md. Only genuine proper nouns (`name`, `reviewerName`) are plain strings.
 */

export interface ServiceCategory {
  id: string
  /** Admin-editable in the backend CMS — used directly now instead of an
   * i18n lookup, since admins can add categories with no matching i18n key. */
  name: string
  icon: string
  providerCount: number
}

export interface Review {
  id: string
  reviewerName: string
  rating: number
  comment: string | null
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
  verified: boolean
  /** Philippines Province -> City/Municipality -> Barangay — see
   * `server/utils/phLocations.ts`. `provinceCode`/`cityCode` are the real
   * PSGC-derived codes (used for filtering); the `*Name` fields and
   * `barangay` are display-ready strings. */
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  barangay: string
}

export interface ProviderProfile extends ProviderSummary {
  bio: string | null
  yearsExperience: number
  jobsCompleted: number
  repeatClientPercent: number
  responseTimeHours: number
  minVisitFee: number
  serviceAreaKm: number
  /** Day ids (`'mon'`..`'sun'`) — see `formatAvailabilityDays` in `app/utils/availability.ts`. */
  availableDays: string[]
  reviews: Review[]
}

export interface Testimonial {
  id: string
  reviewerName: string
  /** Optional — e.g. "Homeowner, Makati". Admin-editable, real content. */
  reviewerRole: string | null
  rating: number
  /** Admin-editable in the backend CMS — used directly instead of an
   * i18n lookup, since admins can add testimonials with no matching key. */
  quoteText: string
}

export interface FaqItem {
  id: string
  /** Admin-editable in the backend CMS — used directly instead of an
   * i18n lookup, since admins can add FAQs with no matching key. */
  question: string
  answer: string
}

export type GalleryTab = 'home' | 'recommended' | 'trending'

export interface GalleryItem {
  categoryId: string
}

export interface ProviderQuery {
  /** Matches a provider whose category is any of these — the /browse filter
   * sidebar's service picker is multi-select. */
  categories?: string[]
  minRating?: number
  verifiedOnly?: boolean
  minRate?: number
  maxRate?: number
  /** Philippines location filters — service-only matches nationwide,
   * +province narrows to that province, +province+city narrows further
   * (per the client spec doc's three documented search behaviors). */
  province?: string
  city?: string
  barangay?: string
  page?: number
  perPage?: number
}

/**
 * A single admin-managed item within a homepage content section (hero
 * slides, trust stats, how-it-works steps, why-choose-us points, app-download
 * badges). The section-level heading/eyebrow copy stays in i18n — only the
 * repeatable items themselves come from the API. See `/api/content/[section]`.
 */
export interface ContentItem {
  title: string | null
  subtitle: string | null
  description: string | null
  icon: string | null
  value: string | null
  imageUrl: string | null
  linkUrl: string | null
}

export type ContentSectionKey = 'hero_slides' | 'trust_stats' | 'how_it_works' | 'why_choose_us' | 'app_download'

export interface PagedResult<T> {
  items: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}
