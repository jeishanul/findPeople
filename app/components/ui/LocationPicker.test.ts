import type { DOMWrapper } from '@vue/test-utils'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { enableAutoUnmount, flushPromises } from '@vue/test-utils'
import { getQuery } from 'h3'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LocationPicker from './LocationPicker.vue'

// Without this, wrappers from earlier tests stay mounted to the real DOM for
// the rest of the file — harmless-looking, but their still-active watchers
// and in-flight fetches interfere with later tests in ways that show up as
// mysterious timeouts (a later `useApi` refetch never resolving) rather than
// an obvious DOM collision.
enableAutoUnmount(afterEach)

registerEndpoint('/api/locations/provinces', () => [
  { code: 'MM', name: 'Metro Manila' },
  { code: 'CEB', name: 'Cebu' },
])
registerEndpoint('/api/locations/cities', (event) => {
  const province = getQuery(event).province
  if (province === 'MM') return [{ code: 'MNL', name: 'Manila City' }]
  if (province === 'CEB') return [{ code: 'CBU', name: 'Cebu City' }]
  return []
})
registerEndpoint('/api/locations/barangays', event =>
  getQuery(event).city === 'MNL' ? [{ name: 'Barangay 1' }] : [])

async function openPicker(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  await wrapper.get('button[aria-haspopup="dialog"]').trigger('click')
  await flushPromises()
}

// Each field's options load via an async fetch (real, if mocked, round-trip
// through `useApi`) that a single `flushPromises` isn't always enough to
// settle — especially a refetch triggered by a reactive query change rather
// than the initial mount — so poll rather than assume it's ready.
async function pickOption(wrapper: Awaited<ReturnType<typeof mountSuspended>>, triggerId: string, label: string) {
  await wrapper.get(`#${triggerId}`).trigger('click')
  await vi.waitFor(() => {
    const found = wrapper.findAll('li[role="option"]').some((li: DOMWrapper<Element>) => li.text() === label)
    if (!found) throw new Error(`option "${label}" not loaded yet`)
  }, { timeout: 3000, interval: 50 })
  const option = wrapper.findAll('li[role="option"]').find((li: DOMWrapper<Element>) => li.text() === label)
  await option!.trigger('click')
  await flushPromises()
}

describe('UiLocationPicker', () => {
  it('shows only the current step, advancing on selection', async () => {
    const wrapper = await mountSuspended(LocationPicker, { props: { id: 'loc' } })
    await openPicker(wrapper)

    // Only the Province step is visible to start — City/Barangay aren't in
    // the DOM at all, so they can't be hidden behind (or overlap) anything.
    expect(wrapper.text()).toContain('Province')
    expect(wrapper.text()).not.toContain('City / Municipality')
    expect(wrapper.findAll('button').some(b => b.text() === 'Back')).toBe(false)

    await pickOption(wrapper, 'loc-province', 'Metro Manila')

    // Picking a province auto-advances to City; Province is no longer shown.
    expect(wrapper.text()).toContain('City / Municipality')
    expect(wrapper.text()).not.toContain('Barangay')
    expect(wrapper.text()).toContain('Back')
  })

  it('lets a user go back to change an earlier step, then forward again without re-picking', async () => {
    const wrapper = await mountSuspended(LocationPicker, { props: { id: 'loc2' } })
    await openPicker(wrapper)
    await pickOption(wrapper, 'loc2-province', 'Metro Manila')
    expect(wrapper.text()).toContain('City / Municipality')

    const backButton = wrapper.findAll('button').find(b => b.text() === 'Back')
    expect(backButton).toBeTruthy()
    await backButton!.trigger('click')
    await flushPromises()

    // Back on Province, the earlier pick is retained and a Next affordance
    // appears (since re-visiting a filled step shouldn't force a re-pick).
    expect(wrapper.text()).toContain('Province')
    expect(wrapper.text()).not.toContain('City / Municipality')
    const nextButton = wrapper.findAll('button').find(b => b.text() === 'Next')
    expect(nextButton).toBeTruthy()

    await nextButton!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('City / Municipality')
  })

  it('cannot be advanced without picking a value for the current step', async () => {
    const wrapper = await mountSuspended(LocationPicker, { props: { id: 'loc3' } })
    await openPicker(wrapper)

    // Nothing chosen yet — there is no Next affordance to skip ahead with.
    expect(wrapper.findAll('button').find(b => b.text() === 'Next')).toBeFalsy()
  })

  it('completes the Barangay step (optional) and closes via Done', async () => {
    const wrapper = await mountSuspended(LocationPicker, { props: { id: 'loc4' } })
    await openPicker(wrapper)
    await pickOption(wrapper, 'loc4-province', 'Metro Manila')
    await pickOption(wrapper, 'loc4-city', 'Manila City')

    expect(wrapper.text()).toContain('Barangay')
    const doneButton = wrapper.findAll('button').find(b => b.text() === 'Done')
    expect(doneButton).toBeTruthy()

    await doneButton!.trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="presentation"]').exists()).toBe(false)
  })
})

describe('UiLocationPicker (inline variant)', () => {
  it('shows every reached field at once, revealing the next as each is picked', async () => {
    const wrapper = await mountSuspended(LocationPicker, { props: { id: 'inline1', variant: 'inline' } })
    await flushPromises()

    // No trigger/popover — the fields are in the DOM directly, and only
    // Province is reachable yet.
    expect(wrapper.find('button[aria-haspopup="dialog"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Province')
    expect(wrapper.text()).not.toContain('City / Municipality')

    await pickOption(wrapper, 'inline1-province', 'Metro Manila')

    // Province stays visible (and selected) instead of collapsing away;
    // City is now revealed alongside it.
    expect(wrapper.get('#inline1-province').text()).toContain('Metro Manila')
    expect(wrapper.text()).toContain('City / Municipality')
    expect(wrapper.text()).not.toContain('Barangay')

    await pickOption(wrapper, 'inline1-city', 'Manila City')

    expect(wrapper.get('#inline1-city').text()).toContain('Manila City')
    expect(wrapper.text()).toContain('Barangay')
  })

  it('keeps City visible but hides Barangay when Province changes', async () => {
    const wrapper = await mountSuspended(LocationPicker, { props: { id: 'inline2', variant: 'inline' } })
    await flushPromises()
    await pickOption(wrapper, 'inline2-province', 'Metro Manila')
    await pickOption(wrapper, 'inline2-city', 'Manila City')
    await pickOption(wrapper, 'inline2-barangay', 'Barangay 1')
    expect(wrapper.text()).toContain('Barangay')

    await pickOption(wrapper, 'inline2-province', 'Cebu')

    // City's own cascading clear fires (new province, old city is invalid),
    // but its field stays in view for a re-pick; Barangay disappears since
    // it now has nothing to belong to.
    expect(wrapper.text()).toContain('City / Municipality')
    expect(wrapper.get('#inline2-city').text()).not.toContain('Manila City')
    expect(wrapper.text()).not.toContain('Barangay')
  })
})
