export interface UseScrollSpyOptions {
  /** Fraction of the viewport height an element's top must cross to become active. */
  threshold?: number
}

/**
 * Tracks which element in an ordered list is "active" as the page scrolls —
 * powers the How It Works scrollytelling (steps 1 -> 2 -> 3 activate as they
 * cross the trigger line).
 */
export function useScrollSpy(elementRefs: Ref<Array<HTMLElement | null>>, options: UseScrollSpyOptions = {}) {
  const { threshold = 0.5 } = options
  const activeIndex = ref(0)

  function recalculate() {
    const elements = elementRefs.value
    let next = 0
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      if (!el) continue
      if (el.getBoundingClientRect().top < window.innerHeight * threshold) next = i
    }
    activeIndex.value = next
  }

  if (import.meta.client) {
    useEventListener(window, 'scroll', recalculate, { passive: true })
    onMounted(recalculate)
  }

  return { activeIndex: readonly(activeIndex), recalculate }
}
