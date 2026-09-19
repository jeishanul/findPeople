import type { KycState, KycStepId } from '#shared/types/dashboard'

/**
 * Session-only overlay of KYC steps submitted via `DashboardKycStepper` this
 * visit — `useState`-backed, ephemeral like the rest of this mock app's data
 * (see CLAUDE.md; no real backend, so there's nothing to persist to). Kept
 * as a shared composable rather than local component state so the KYC
 * banner on the dashboard overview (`DashboardKycBanner`, fed from a
 * separate `/dashboard/summary` fetch) stays in sync with what was just
 * submitted on the profile page within the same session.
 */
export function useKycSubmissions() {
  const submittedStepIds = useState<KycStepId[]>('kyc-submitted-steps', () => [])

  function markSubmitted(stepId: KycStepId) {
    if (!submittedStepIds.value.includes(stepId)) {
      submittedStepIds.value = [...submittedStepIds.value, stepId]
    }
  }

  function applyOverlay(kyc: KycState): KycState {
    if (submittedStepIds.value.length === 0) return kyc
    const steps = kyc.steps.map(step =>
      submittedStepIds.value.includes(step.id) && step.status === 'not_started'
        ? { ...step, status: 'in_review' as const }
        : step,
    )
    return { steps, isVerified: kyc.isVerified }
  }

  return {
    markSubmitted,
    applyOverlay,
  }
}
