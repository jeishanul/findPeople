<script setup lang="ts">
import type { KycState, KycStepId, KycStepStatus } from '#shared/types/dashboard'

// Auto-imported as <DashboardKycStepper/>. The full 3-step identity
// verification flow on the profile page — mandatory before a provider can
// accept bookings or get paid out (see CLAUDE.md brief and
// `dashboard/profile.vue`).
const props = defineProps<{
  kyc: KycState
}>()

const { t } = useI18n()

const STEP_ORDER: KycStepId[] = ['identity', 'selfie', 'address']

const orderedSteps = computed(() =>
  STEP_ORDER
    .map(id => props.kyc.steps.find(step => step.id === id))
    .filter(step => step !== undefined),
)

function bodyFor(id: KycStepId, status: KycStepStatus) {
  if (id === 'identity') {
    return status === 'verified'
      ? t('dashboard.profile.kyc.steps.identity.verifiedBody')
      : t('dashboard.profile.kyc.steps.identity.pendingBody')
  }
  if (id === 'selfie') {
    return status === 'in_review'
      ? t('dashboard.profile.kyc.steps.selfie.inReviewBody')
      : t('dashboard.profile.kyc.steps.selfie.pendingBody')
  }
  return t('dashboard.profile.kyc.steps.address.pendingBody')
}

function statusLabel(status: KycStepStatus) {
  if (status === 'verified') return t('dashboard.profile.kyc.statusVerified')
  if (status === 'in_review') return t('dashboard.profile.kyc.statusInReview')
  return t('dashboard.profile.kyc.statusNotStarted')
}

const STATUS_VARIANT: Record<KycStepStatus, 'primary' | 'accent' | 'neutral'> = {
  verified: 'primary',
  in_review: 'accent',
  not_started: 'neutral',
}

const STEP_CIRCLE_CLASS: Record<KycStepStatus, string> = {
  verified: 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100',
  in_review: 'bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-100',
  not_started: 'bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40',
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center gap-4 rounded-2xl border border-red-600/30 bg-red-50 p-5 dark:bg-red-900/10">
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <UiIcon
          name="alert-triangle"
          :size="21"
        />
      </span>
      <div>
        <div class="text-[15px] font-bold">
          {{ t('dashboard.profile.kyc.mandatoryTitle') }}
        </div>
        <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
          {{ t('dashboard.profile.kyc.mandatoryBody') }}
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <div
        v-for="(step, index) in orderedSteps"
        :key="step.id"
        class="flex gap-4 py-4"
        :class="index < orderedSteps.length - 1 && 'border-b border-black/10 dark:border-white/10'"
      >
        <span
          class="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
          :class="STEP_CIRCLE_CLASS[step.status]"
        >
          <UiIcon
            v-if="step.status === 'verified'"
            name="check"
            :size="15"
          />
          <template v-else>
            {{ index + 1 }}
          </template>
        </span>
        <div class="flex-1">
          <div class="flex items-center justify-between gap-3">
            <div class="text-[14.5px] font-bold">
              {{ index + 1 }}. {{ t(`dashboard.profile.kyc.steps.${step.id}.title`) }}
            </div>
            <UiTag :variant="STATUS_VARIANT[step.status]">
              {{ statusLabel(step.status) }}
            </UiTag>
          </div>
          <p class="mt-1 text-[13px] text-black/60 dark:text-white/60">
            {{ bodyFor(step.id, step.status) }}
          </p>

          <div
            v-if="step.status === 'not_started'"
            class="mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/20 p-6 text-black/40 dark:border-white/20 dark:text-white/40"
          >
            <UiIcon
              name="upload-cloud"
              :size="26"
            />
            <div class="text-[13px]">
              {{ t('dashboard.profile.kyc.dropzone') }}
            </div>
            <UiButton
              variant="secondary"
              class="px-4 py-2 text-xs"
            >
              {{ t('dashboard.profile.kyc.browseFiles') }}
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2.5 text-xs text-black/40 dark:text-white/40">
      <UiIcon
        name="info"
        :size="15"
      />
      {{ t('dashboard.profile.kyc.complianceNote') }}
    </div>
  </div>
</template>
