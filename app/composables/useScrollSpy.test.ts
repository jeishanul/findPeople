import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useScrollSpy } from './useScrollSpy'

function elementWithTop(top: number): HTMLElement {
  const el = document.createElement('div')
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
  return el
}

describe('useScrollSpy', () => {
  it('activates the last element whose top has crossed the threshold line', () => {
    const elementRefs = ref([
      elementWithTop(-200),
      elementWithTop(50),
      elementWithTop(1000),
    ])
    const { activeIndex, recalculate } = useScrollSpy(elementRefs, { threshold: 0.5 })

    recalculate()

    expect(activeIndex.value).toBe(1)
  })

  it('stays at the first element when none have crossed yet', () => {
    const elementRefs = ref([elementWithTop(900), elementWithTop(1200)])
    const { activeIndex, recalculate } = useScrollSpy(elementRefs, { threshold: 0.5 })

    recalculate()

    expect(activeIndex.value).toBe(0)
  })
})
