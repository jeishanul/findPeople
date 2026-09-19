const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

/**
 * Orders a subset of day ids into calendar order and joins their labels —
 * used by both `pages/profile.vue` (editing) and `pages/providers/[id].vue`
 * (public display), so a provider's actual selected days drive what
 * consumers see instead of a hardcoded sentence.
 *
 * Returns `''` when no days are selected, or `everyDayLabel` when all 7 are
 * — callers wrap the result in their own translated sentence.
 */
export function formatAvailabilityDays(days: string[], dayLabel: (day: string) => string, everyDayLabel: string): string {
  const ordered = DAY_ORDER.filter(day => days.includes(day))
  if (ordered.length === 0) return ''
  if (ordered.length === 7) return everyDayLabel
  return ordered.map(dayLabel).join(', ')
}
