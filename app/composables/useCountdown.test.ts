import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts inactive with no remaining time', () => {
    const countdown = useCountdown(45)

    expect(countdown.remaining.value).toBe(0)
    expect(countdown.isActive.value).toBe(false)
  })

  it('start() counts down one second at a time until it hits zero', () => {
    const countdown = useCountdown(3)

    countdown.start()
    expect(countdown.remaining.value).toBe(3)
    expect(countdown.isActive.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(countdown.remaining.value).toBe(2)

    vi.advanceTimersByTime(2000)
    expect(countdown.remaining.value).toBe(0)
    expect(countdown.isActive.value).toBe(false)
  })

  it('start() with an explicit duration overrides the default', () => {
    const countdown = useCountdown(45)

    countdown.start(5)
    expect(countdown.remaining.value).toBe(5)
  })

  it('stop() freezes the remaining time and stops ticking', () => {
    const countdown = useCountdown(10)

    countdown.start()
    vi.advanceTimersByTime(2000)
    countdown.stop()
    const frozen = countdown.remaining.value

    vi.advanceTimersByTime(5000)
    expect(countdown.remaining.value).toBe(frozen)
  })

  it('restarting cancels the previous timer instead of stacking intervals', () => {
    const countdown = useCountdown(10)

    countdown.start()
    vi.advanceTimersByTime(1000)
    countdown.start(3)

    vi.advanceTimersByTime(1000)
    expect(countdown.remaining.value).toBe(2)
  })
})
