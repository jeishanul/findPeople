export function formatDate(date: Date | string, locale = 'en-US'): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(value)
}

/** Caps a notification-style count badge at "9+" instead of ever growing unbounded. */
export function formatBadgeCount(count: number): string {
  return count > 9 ? '9+' : String(count)
}
