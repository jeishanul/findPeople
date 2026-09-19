import type {
  AccountSettings,
  ActivityItem,
  ClientServed,
  ConsumerKpis,
  Conversation,
  DashboardSummary,
  KycState,
  NotificationItem,
  ProviderKpis,
  ProviderProfileDetail,
  PurchaseRecord,
  SavedProvider,
  ServiceListing,
  UserRole,
} from '#shared/types/dashboard'

/**
 * In-memory mock data for the logged-in user panel, standing in for a real
 * database and session the same way `marketplaceData.ts` does for the public
 * site (see CLAUDE.md — there's no auth backend yet, so every dashboard route
 * just serves this one demo account regardless of who's "logged in").
 */

const KYC_STATE: KycState = {
  steps: [
    { id: 'identity', status: 'verified' },
    { id: 'selfie', status: 'in_review' },
    { id: 'address', status: 'not_started' },
  ],
  isVerified: false,
}

const PROVIDER_KPIS: ProviderKpis = {
  activeGigs: 6,
  jobsCompletedThisMonth: 14,
  jobsCompletedChangePercent: 18,
  clientsServed: 47,
  repeatClients: 12,
  averageRating: 4.9,
  reviewCount: 128,
}

const CONSUMER_KPIS: ConsumerKpis = {
  activeOrders: 2,
  ordersInProgress: 1,
  totalOrders: 9,
  providersHired: 6,
  providersHiredTwice: 3,
  savedProviders: 4,
  savedProvidersAvailableNow: 2,
}

const PROVIDER_ACTIVITY: ActivityItem[] = [
  { id: 'pa-1', kind: 'new_booking', personName: 'Alicia Moreno', categoryId: 'cleaning', timeAgoHours: 2 },
  { id: 'pa-2', kind: 'payment_received', personName: 'Daniel Ruiz', categoryId: 'gardening', amountUsd: 120, timeAgoHours: 5 },
  { id: 'pa-3', kind: 'review_received', personName: 'Jonas Berg', categoryId: 'cleaning', ratingGiven: 5, timeAgoHours: 24 },
  { id: 'pa-4', kind: 'new_message', personName: 'Priya Nair', categoryId: 'cleaning', timeAgoHours: 26 },
]

const CONSUMER_ACTIVITY: ActivityItem[] = [
  { id: 'ca-1', kind: 'order_completed', personName: 'Marcus Tan', categoryId: 'plumber', timeAgoHours: 3 },
  { id: 'ca-2', kind: 'new_message', personName: 'Marcus Tan', categoryId: 'plumber', timeAgoHours: 6 },
  { id: 'ca-3', kind: 'refund_processed', personName: 'Nadia Brooks', categoryId: 'painter', amountUsd: 40, timeAgoHours: 48 },
  { id: 'ca-4', kind: 'new_order', personName: 'Elena Cho', categoryId: 'electrician', timeAgoHours: 72 },
]

const CLIENTS_SERVED: ClientServed[] = [
  { id: 'cl-1', clientName: 'Alicia Moreno', categoryId: 'cleaning', date: '2026-09-14', amountUsd: 95, status: 'completed', rating: 5, repeatClient: true },
  { id: 'cl-2', clientName: 'Daniel Ruiz', categoryId: 'gardening', date: '2026-09-12', amountUsd: 120, status: 'completed', rating: 5, repeatClient: false },
  { id: 'cl-3', clientName: 'Priya Nair', categoryId: 'cleaning', date: '2026-09-20', amountUsd: 95, status: 'upcoming', rating: null, repeatClient: true },
  { id: 'cl-4', clientName: 'Jonas Berg', categoryId: 'cleaning', date: '2026-09-10', amountUsd: 150, status: 'completed', rating: 4.8, repeatClient: false },
  { id: 'cl-5', clientName: 'Sana Khatri', categoryId: 'gardening', date: '2026-09-09', amountUsd: 110, status: 'completed', rating: 5, repeatClient: true },
  { id: 'cl-6', clientName: 'Theo Walsh', categoryId: 'cleaning', date: '2026-09-05', amountUsd: 180, status: 'cancelled', rating: null, repeatClient: false },
  { id: 'cl-7', clientName: 'Mei Fujita', categoryId: 'cleaning', date: '2026-09-01', amountUsd: 95, status: 'completed', rating: 4.9, repeatClient: true },
  { id: 'cl-8', clientName: 'Liam Hart', categoryId: 'gardening', date: '2026-09-22', amountUsd: 120, status: 'upcoming', rating: null, repeatClient: false },
]

const PURCHASES: PurchaseRecord[] = [
  { id: 'pu-1', providerName: 'Marcus Tan', categoryId: 'plumber', date: '2026-09-17', status: 'completed' },
  { id: 'pu-2', providerName: 'Elena Cho', categoryId: 'electrician', date: '2026-09-16', status: 'in_progress' },
  { id: 'pu-3', providerName: 'Sana Khatri', categoryId: 'appliance-repair', date: '2026-09-08', status: 'completed' },
  { id: 'pu-4', providerName: 'Ravi Gupta', categoryId: 'carpenter', date: '2026-09-04', status: 'completed' },
  { id: 'pu-5', providerName: 'Nadia Brooks', categoryId: 'painter', date: '2026-08-29', status: 'cancelled' },
  { id: 'pu-6', providerName: 'Jae Lin', categoryId: 'ac-service', date: '2026-09-21', status: 'in_progress' },
  { id: 'pu-7', providerName: 'Owen Ward', categoryId: 'electrician', date: '2026-08-20', status: 'completed' },
]

const PROVIDER_PROFILE: ProviderProfileDetail = {
  fullName: 'Amara Chen',
  headline: 'Residential cleaning & garden care specialist',
  bio: '8 years helping local families keep their homes and gardens spotless. Fully insured, bring my own eco-friendly supplies.',
  phone: '+1 (415) 555-0148',
  email: 'amara.chen@example.com',
  photoUrl: null,
  coverPhotoUrl: null,
  recentWorkPhotoUrls: [],
  provinceCode: '0722',
  cityCode: '072217',
  barangay: 'Adlaon',
  address: '123 Mango Avenue',
  categoryId: 'cleaning',
  skillIds: ['deep-clean', 'move-out-clean', 'landscaping', 'garden-upkeep'],
  yearsExperience: 8,
  hourlyRateUsd: 45,
  minVisitFeeUsd: 30,
  responseTimeHours: 2,
  availableDays: ['mon', 'tue', 'wed', 'fri', 'sat'],
  memberSince: '2024-03-01',
  averageRating: 4.9,
  reviewCount: 128,
  clientsServed: 47,
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'alicia',
    personName: 'Alicia Moreno',
    role: 'client',
    categoryId: 'cleaning',
    lastMessagePreview: 'Can you come 30 minutes earlier?',
    timeAgoHours: 24,
    unread: true,
    online: true,
    lastSeenLabel: '',
    messages: [
      { id: 'm1', fromMe: false, text: 'Hi! Looking forward to Saturday\'s cleaning.' },
      { id: 'm2', fromMe: true, text: 'See you then — I\'ll bring the eco-friendly supplies as usual.', status: 'seen' },
      {
        id: 'm3',
        fromMe: true,
        text: 'Here\'s how it looked after the last visit:',
        status: 'seen',
        attachment: { type: 'image', name: 'kitchen-after.jpg' },
      },
      { id: 'm4', fromMe: false, text: 'Can you come 30 minutes earlier? I have somewhere to be at 3.' },
    ],
  },
  {
    id: 'marcus',
    personName: 'Marcus Tan',
    role: 'provider',
    categoryId: 'plumber',
    lastMessagePreview: 'On my way, 10 minutes out.',
    timeAgoHours: 6,
    unread: false,
    online: false,
    lastSeenLabel: 'Last seen 35m ago',
    messages: [
      { id: 'm1', fromMe: true, text: 'Hey, is the plumber still on for 2pm today?', status: 'seen' },
      { id: 'm2', fromMe: false, text: 'Yep, running a bit early actually.' },
      { id: 'm3', fromMe: false, text: 'On my way, 10 minutes out.' },
    ],
  },
  {
    id: 'priya',
    personName: 'Priya Nair',
    role: 'client',
    categoryId: 'cleaning',
    lastMessagePreview: 'Thank you, see you Saturday!',
    timeAgoHours: 48,
    unread: false,
    online: true,
    lastSeenLabel: '',
    messages: [
      { id: 'm1', fromMe: false, text: 'The kitchen looks amazing, thank you!' },
      { id: 'm2', fromMe: true, text: 'So glad you\'re happy with it — see you again soon.', status: 'seen' },
      { id: 'm3', fromMe: false, text: 'Thank you, see you Saturday!' },
    ],
  },
  {
    id: 'elena',
    personName: 'Elena Cho',
    role: 'provider',
    categoryId: 'electrician',
    lastMessagePreview: 'Lesson confirmed for Monday 4pm',
    timeAgoHours: 72,
    unread: true,
    online: false,
    lastSeenLabel: 'Last seen 1d ago',
    messages: [
      { id: 'm1', fromMe: true, text: 'Can we move next week\'s lesson to Monday?', status: 'seen' },
      {
        id: 'm2',
        fromMe: false,
        text: 'Here is the updated invoice.',
        attachment: { type: 'document', name: 'invoice-sep.pdf', sizeLabel: '128 KB' },
      },
      { id: 'm3', fromMe: false, text: 'Confirmed for Monday 4pm — see you then!' },
    ],
  },
  {
    id: 'daniel',
    personName: 'Daniel Ruiz',
    role: 'client',
    categoryId: 'gardening',
    lastMessagePreview: '5 stars, thanks again!',
    timeAgoHours: 96,
    unread: false,
    online: false,
    lastSeenLabel: 'Last seen 3d ago',
    messages: [
      { id: 'm1', fromMe: false, text: 'The garden looks incredible, thank you.' },
      { id: 'm2', fromMe: false, text: '5 stars, thanks again!' },
    ],
  },
]

const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', kind: 'new_booking', topic: 'bookings', personName: 'Alicia Moreno', categoryId: 'cleaning', timeAgoHours: 2, read: false },
  { id: 'n2', kind: 'payment_received', topic: 'payments', personName: 'Daniel Ruiz', categoryId: 'gardening', amountUsd: 120, timeAgoHours: 5, read: false },
  { id: 'n3', kind: 'new_message', topic: 'messages', personName: 'Marcus Tan', timeAgoHours: 6, read: true },
  { id: 'n4', kind: 'review_received', topic: 'bookings', personName: 'Jonas Berg', ratingGiven: 5, timeAgoHours: 24, read: true },
  { id: 'n5', kind: 'order_completed', topic: 'bookings', personName: 'Marcus Tan', categoryId: 'plumber', timeAgoHours: 24, read: true },
  { id: 'n6', kind: 'kyc_submitted', topic: 'bookings', timeAgoHours: 24, read: true },
  { id: 'n7', kind: 'refund_processed', topic: 'payments', amountUsd: 40, timeAgoHours: 48, read: true },
  { id: 'n8', kind: 'booking_reminder', topic: 'bookings', personName: 'Priya Nair', categoryId: 'cleaning', timeAgoHours: 72, read: true },
]

const SERVICES: ServiceListing[] = [
  { id: 'sv-1', title: 'Standard house cleaning', categoryId: 'cleaning', description: 'Full home clean including kitchen, bathrooms and living areas. Eco-friendly supplies included.', durationLabel: '2-3 hours', priceLabel: '$45/hr', bookingsCount: 32, rating: 4.9, status: 'active' },
  { id: 'sv-2', title: 'Deep cleaning', categoryId: 'cleaning', description: 'A thorough top-to-bottom clean — inside appliances, baseboards, windows and grout included.', durationLabel: '4-5 hours', priceLabel: '$150 flat', bookingsCount: 9, rating: 4.8, status: 'active' },
  { id: 'sv-3', title: 'Garden maintenance', categoryId: 'gardening', description: 'Mowing, hedge trimming and seasonal planting for small to mid-size home gardens.', durationLabel: 'weekly or one-off', priceLabel: '$38/hr', bookingsCount: 21, rating: 4.9, status: 'active' },
  { id: 'sv-4', title: 'Move-out cleaning', categoryId: 'cleaning', description: 'End-of-lease deep clean, currently paused while booked out through next month.', durationLabel: 'full day', priceLabel: '$180 flat', bookingsCount: 6, rating: 4.7, status: 'paused' },
]

const SAVED_PROVIDERS: SavedProvider[] = [
  { id: 'marcus', name: 'Marcus Tan', categoryId: 'plumber', rating: 4.9, reviewCount: 84, hourlyRateUsd: 55, lastBookedLabel: 'Booked Sep 17', verified: true },
  { id: 'elena', name: 'Elena Cho', categoryId: 'electrician', rating: 5.0, reviewCount: 41, hourlyRateUsd: 40, lastBookedLabel: 'Booked Sep 16', verified: true },
  { id: 'sana', name: 'Sana Khatri', categoryId: 'appliance-repair', rating: 4.8, reviewCount: 63, hourlyRateUsd: 25, lastBookedLabel: 'Booked Sep 8', verified: true },
  { id: 'ravi', name: 'Ravi Gupta', categoryId: 'carpenter', rating: 4.9, reviewCount: 37, hourlyRateUsd: 30, lastBookedLabel: 'Booked Sep 4', verified: true },
  { id: 'nadia', name: 'Nadia Brooks', categoryId: 'painter', rating: 4.6, reviewCount: 22, hourlyRateUsd: 50, lastBookedLabel: 'Booked Aug 29', verified: false },
  { id: 'jae', name: 'Jae Lin', categoryId: 'ac-service', rating: 4.8, reviewCount: 28, hourlyRateUsd: 28, lastBookedLabel: 'Never booked', verified: false },
]

const ACCOUNT_SETTINGS: AccountSettings = {
  fullName: 'Amara Chen',
  email: 'amara.chen@example.com',
  phone: '+1 (415) 555-0148',
  twoFactorEnabled: false,
  passwordChangedLabel: '4 months ago',
  notificationPreferences: {
    bookingRequests: true,
    messages: true,
    marketing: false,
  },
  language: 'en',
}

export function getDashboardSummary(role: UserRole): DashboardSummary {
  return {
    role,
    providerKpis: PROVIDER_KPIS,
    consumerKpis: CONSUMER_KPIS,
    activity: role === 'provider' ? PROVIDER_ACTIVITY : CONSUMER_ACTIVITY,
    kyc: KYC_STATE,
  }
}

export function getClientsServed(): ClientServed[] {
  return CLIENTS_SERVED
}

export function getPurchases(): PurchaseRecord[] {
  return PURCHASES
}

export function getProviderProfile(): ProviderProfileDetail {
  return PROVIDER_PROFILE
}

export function getConversations(): Conversation[] {
  return CONVERSATIONS
}

export function getNotifications(): NotificationItem[] {
  return NOTIFICATIONS
}

export function getServiceListings(): ServiceListing[] {
  return SERVICES
}

export function getSavedProviders(): SavedProvider[] {
  return SAVED_PROVIDERS
}

export function getAccountSettings(): AccountSettings {
  return ACCOUNT_SETTINGS
}
