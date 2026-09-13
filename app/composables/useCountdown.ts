/**
 * A simple second-by-second countdown (e.g. an OTP "resend in 0:45" timer).
 * `start()` (re)starts it from a given duration; `isActive` flips to `false`
 * the instant it reaches zero, which callers use to gate a "resend" action.
 */
export function useCountdown(defaultSeconds: number) {
  const remaining = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  function stop() {
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
  }

  function start(seconds: number = defaultSeconds) {
    stop()
    remaining.value = seconds
    if (!import.meta.client || seconds <= 0) return
    timer = setInterval(() => {
      remaining.value -= 1
      if (remaining.value <= 0) stop()
    }, 1000)
  }

  if (getCurrentScope()) onScopeDispose(stop)

  return {
    remaining: computed(() => remaining.value),
    isActive: computed(() => remaining.value > 0),
    start,
    stop,
  }
}
