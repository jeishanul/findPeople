import type { ServiceCategory } from '#shared/types/marketplace'

/** Bounds for the browse page's price-range filter/slider — shared between
 * `ProviderFilterSidebar` (slider + inputs) and `browse.vue` (so it only adds
 * `minPrice`/`maxPrice` to the URL when they've actually been narrowed). */
export const PRICE_MIN = 0
export const PRICE_MAX = 150

/** Support contact details — shared between the footer and the download-app
 * section's helpline strip, so there's exactly one place to update them. */
export const SUPPORT_PHONE = '+8801303580593'
export const SUPPORT_EMAIL = 'shishirjeishanul@gmail.com'

/**
 * `ServiceCategory.icon` is a plain string on the wire (shared types can't
 * depend on the app's icon set) — this asserts it's one of ours for display.
 */
export function asIconName(icon: string): IconName {
  return icon as IconName
}

/** Looks up a category's icon for display alongside a provider card/row. */
export function getCategoryIcon(categories: ServiceCategory[], categoryId: string): IconName {
  return asIconName(categories.find(category => category.id === categoryId)?.icon ?? 'briefcase')
}
