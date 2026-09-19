import type { DOMWrapper } from '@vue/test-utils'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { getQuery } from 'h3'
import { describe, expect, it } from 'vitest'
import LocationPicker from './LocationPicker.vue'

registerEndpoint('/api/locations/provinces', () => [{ code: 'MM', name: 'Metro Manila' }])
registerEndpoint('/api/locations/cities', event =>
  getQuery(event).province === 'MM' ? [{ code: 'MNL', name: 'Manila City' }] : [])
registerEndpoint('/api/locations/barangays', event =>
  getQuery(event).city === 'MNL' ? [{ name: 'Barangay 1' }] : [])

async function openPicker(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  await wrapper.get('button[aria-haspopup="dialog"]').trigger('click')
  await flushPromises()
}

async function pickOption(wrapper: Awaited<ReturnType<typeof mountSuspended>>, triggerId: string, label: string) {
  await wrapper.get(`#${triggerId}`).trigger('click')
  await flushPromises()
  const option = wrapper.findAll('li[role="option"]').find((li: DOMWrapper<Element>) => li.text() === label)
  expect(option).toBeTruthy()
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
