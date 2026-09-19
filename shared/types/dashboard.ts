/**
 * Display copy for all of these lives in i18n messages under `dashboard.*`
 * (see CLAUDE.md — Internationalization) — only proper nouns (`clientName`,
 * `providerName`) are plain strings here. `categoryId` reuses the same ids
 * as `ServiceCategory` in `marketplace.ts` (`marketplace.categories.<id>.label`).
 */

export type UserRole = 'provider' | 'consumer'

export type KycStepId = 'identity' | 'selfie' | 'address'
export type KycStepStatus = 'verified' | 'in_review' | 'not_started'

export interface KycStep {
  id: KycStepId
  status: KycStepStatus
}

export interface KycState {
  steps: KycStep[]
  isVerified: boolean
}

export type BookingStatus = 'completed' | 'upcoming' | 'in_progress' | 'cancelled'

export interface ClientServed {
  id: string
  clientName: string
  categoryId: string
  date: string
  amountUsd: number
  status: BookingStatus
  rating: number | null
  repeatClient: boolean
}

export interface PurchaseRecord {
  id: string
  providerName: string
  categoryId: string
  date: string
  status: BookingStatus
}

export interface ProviderKpis {
  activeGigs: number
  jobsCompletedThisMonth: number
  jobsCompletedChangePercent: number
  clientsServed: number
  repeatClients: number
  averageRating: number
  reviewCount: number
}

export interface ConsumerKpis {
  activeOrders: number
  ordersInProgress: number
  totalOrders: number
  providersHired: number
  providersHiredTwice: number
  savedProviders: number
  savedProvidersAvailableNow: number
}

export type ActivityKind
  = | 'new_booking'
    | 'payment_received'
    | 'review_received'
    | 'new_message'
    | 'order_completed'
    | 'refund_processed'
    | 'new_order'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  personName: string
  categoryId: string
  amountUsd?: number
  ratingGiven?: number
  timeAgoHours: number
}

export interface DashboardSummary {
  role: UserRole
  providerKpis: ProviderKpis
  consumerKpis: ConsumerKpis
  activity: ActivityItem[]
  kyc: KycState
}

export interface ProviderProfileDetail {
  fullName: string
  headline: string
  bio: string
  phone: string
  email: string
  /** Client-side object URLs from a local file pick — see CLAUDE.md (no real
   * upload backend yet), `null` until the provider picks one. */
  photoUrl: string | null
  coverPhotoUrl: string | null
  recentWorkPhotoUrls: string[]
  /** Province/city are PH location codes (see `server/utils/phLocations.ts`);
   * barangay is stored by name, matching `UiLocationPicker`'s own model. */
  provinceCode: string
  cityCode: string
  barangay: string
  address: string
  categoryId: string
  skillIds: string[]
  yearsExperience: number
  hourlyRateUsd: number
  minVisitFeeUsd: number
  responseTimeHours: number
  availableDays: string[]
  memberSince: string
  // Read-only, system-computed from real completed bookings/reviews — never
  // provider-editable (see `pages/profile.vue`'s "Rate & availability" vs
  // stats-summary split).
  averageRating: number
  reviewCount: number
  clientsServed: number
}

export type ConversationRole = 'client' | 'provider'

export type MessageStatus = 'sent' | 'delivered' | 'seen'

export type AttachmentType = 'image' | 'video' | 'document'

export interface MessageAttachment {
  type: AttachmentType
  name: string
  /** Omitted for seed/mock data (no real file) — renders as a placeholder.
   * Present (a `blob:` URL) for anything the person just attached locally. */
  url?: string
  sizeLabel?: string
}

export type QuoteStatus = 'pending' | 'accepted' | 'declined'

/** A structured price a provider sends in-chat (e.g. "$50 for 3 hours, +$10/hr
 * for extra work") — see `DashboardQuoteFormModal`/`DashboardQuoteCard` and
 * `useBookings`. Accepting one creates a booking; see `useBookings.acceptQuote`. */
export interface Quote {
  id: string
  basePriceUsd: number
  baseHours: number
  extraHourlyRateUsd: number
  note?: string
  status: QuoteStatus
}

export interface ConversationMessage {
  id: string
  fromMe: boolean
  text: string
  /** Only meaningful for `fromMe` messages — the other side's messages are
   * always effectively "seen" by the time we render them. */
  status?: MessageStatus
  attachment?: MessageAttachment
  /** Present when this message is a structured price quote rather than a
   * plain text/attachment message — see `Quote`. */
  quote?: Quote
}

export interface Conversation {
  id: string
  personName: string
  role: ConversationRole
  categoryId: string
  lastMessagePreview: string
  timeAgoHours: number
  unread: boolean
  online: boolean
  /** Shown instead of "Online" when `online` is false. */
  lastSeenLabel: string
  messages: ConversationMessage[]
  /** The marketplace provider id (`slugify`d name, matching
   * `ProviderProfile.id`) this conversation is with — links the two
   * otherwise-separate mock datasets. Absent for older seed rows. */
  providerId?: string
}

export type NotificationTopic = 'bookings' | 'payments' | 'messages'

export type NotificationKind
  = | 'new_booking'
    | 'payment_received'
    | 'new_message'
    | 'review_received'
    | 'order_completed'
    | 'kyc_submitted'
    | 'refund_processed'
    | 'booking_reminder'

export interface NotificationItem {
  id: string
  kind: NotificationKind
  topic: NotificationTopic
  personName?: string
  categoryId?: string
  amountUsd?: number
  ratingGiven?: number
  timeAgoHours: number
  read: boolean
}

export type ServiceStatus = 'active' | 'paused'

export interface ServiceListing {
  id: string
  title: string
  categoryId: string
  description: string
  durationLabel: string
  priceLabel: string
  bookingsCount: number
  rating: number
  status: ServiceStatus
}

export interface SavedProvider {
  id: string
  name: string
  categoryId: string
  rating: number
  reviewCount: number
  hourlyRateUsd: number
  lastBookedLabel: string
  verified: boolean
}

export interface NotificationPreferences {
  bookingRequests: boolean
  messages: boolean
  marketing: boolean
}

export interface AccountSettings {
  fullName: string
  email: string
  phone: string
  twoFactorEnabled: boolean
  passwordChangedLabel: string
  notificationPreferences: NotificationPreferences
  language: string
}
