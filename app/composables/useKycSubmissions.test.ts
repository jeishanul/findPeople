import { describe, expect, it } from 'vitest'
import { useKycSubmissions } from './useKycSubmissions'

const BASE_KYC = {
  steps: [
    { id: 'identity' as const, status: 'not_started' as const },
    { id: 'selfie' as const, status: 'in_review' as const },
    { id: 'address' as const, status: 'verified' as const },
  ],
  isVerified: false,
}

describe('useKycSubmissions', () => {
  it('leaves kyc state unchanged when nothing has been submitted', () => {
    const { applyOverlay } = useKycSubmissions()

    expect(applyOverlay(BASE_KYC)).toEqual(BASE_KYC)
  })

  it('flips a not_started step to in_review once marked submitted', () => {
    const { markSubmitted, applyOverlay } = useKycSubmissions()

    markSubmitted('identity')
    const result = applyOverlay(BASE_KYC)

    expect(result.steps.find(s => s.id === 'identity')?.status).toBe('in_review')
  })

  it('never downgrades a step that is already in_review or verified', () => {
    const { markSubmitted, applyOverlay } = useKycSubmissions()

    markSubmitted('selfie')
    markSubmitted('address')
    const result = applyOverlay(BASE_KYC)

    expect(result.steps.find(s => s.id === 'selfie')?.status).toBe('in_review')
    expect(result.steps.find(s => s.id === 'address')?.status).toBe('verified')
  })

  it('shares submissions across separate calls (single source of truth)', () => {
    const a = useKycSubmissions()
    a.markSubmitted('identity')

    const b = useKycSubmissions()
    const result = b.applyOverlay(BASE_KYC)

    expect(result.steps.find(s => s.id === 'identity')?.status).toBe('in_review')
  })
})
