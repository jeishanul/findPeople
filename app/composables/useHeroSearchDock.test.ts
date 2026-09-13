import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useHeroSearchDock } from './useHeroSearchDock'

describe('useHeroSearchDock', () => {
  it('docks once the anchor scrolls above the header offset', () => {
    const { isDocked, observe } = useHeroSearchDock()
    const anchorEl = document.createElement('div')
    const anchor = ref(anchorEl)
    const rectSpy = vi.spyOn(anchorEl, 'getBoundingClientRect')

    rectSpy.mockReturnValue({ top: 200 } as DOMRect)
    observe(anchor, 88)
    window.dispatchEvent(new Event('scroll'))
    expect(isDocked.value).toBe(false)

    rectSpy.mockReturnValue({ top: 50 } as DOMRect)
    window.dispatchEvent(new Event('scroll'))
    expect(isDocked.value).toBe(true)
  })
})
