import { describe, expect, it } from 'vitest'
import { formatBadgeCount } from './format'

describe('formatBadgeCount', () => {
  it('shows the exact count at or below 9', () => {
    expect(formatBadgeCount(0)).toBe('0')
    expect(formatBadgeCount(5)).toBe('5')
    expect(formatBadgeCount(9)).toBe('9')
  })

  it('caps anything above 9 at "9+"', () => {
    expect(formatBadgeCount(10)).toBe('9+')
    expect(formatBadgeCount(142)).toBe('9+')
  })
})
