/**
 * Cross-component "is the hero search bar scrolled out of view" flag. The home
 * page's hero observes its own search bar and sets this; `AppHeader` reads it
 * to swap its nav for a compact docked search bar. `useState` keeps it
 * request-isolated under SSR (see CLAUDE.md — never a module-level ref here).
 */
export function useHeroSearchDock() {
  const isDocked = useState('hero-search-docked', () => false)

  function observe(anchor: Ref<HTMLElement | null>, headerOffset = 88) {
    function recalculate() {
      const el = anchor.value
      if (!el) return
      isDocked.value = el.getBoundingClientRect().top < headerOffset
    }

    if (import.meta.client) {
      useEventListener(window, 'scroll', recalculate, { passive: true })
      onMounted(recalculate)
      onUnmounted(() => {
        isDocked.value = false
      })
    }
  }

  return { isDocked, observe }
}
