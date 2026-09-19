import { describe, expect, it } from 'vitest'
import { formatAvailabilityDays } from './availability'

const label = (day: string) => day.toUpperCase()

describe('formatAvailabilityDays', () => {
  it('returns an empty string when no days are selected', () => {
    expect(formatAvailabilityDays([], label, 'every day')).toBe('')
  })

  it('returns the every-day label when all 7 days are selected', () => {
    expect(formatAvailabilityDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], label, 'every day')).toBe('every day')
  })

  it('orders a subset into calendar order regardless of input order', () => {
    expect(formatAvailabilityDays(['fri', 'mon', 'wed'], label, 'every day')).toBe('MON, WED, FRI')
  })
})
