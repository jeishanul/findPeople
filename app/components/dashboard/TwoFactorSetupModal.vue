<script setup lang="ts">
import type { TwoFactorConfirmResult, TwoFactorSetup } from '#shared/types/auth'

// Auto-imported as <DashboardTwoFactorSetupModal/>. The "turn 2FA on" flow:
// fetch a fresh secret + QR code on open, verify one code from the person's
// authenticator app, then show one-time recovery codes. Each open starts a
// brand-new secret (see `TwoFactorController::setup`), so closing without
// confirming just discards that attempt — nothing is enabled until `confirm`
// succeeds.
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  enabled: []
}>()

const { t } = useI18n()
const titleId = useId()

type Step = 'loading' | 'qr' | 'recovery-codes'
const step = ref<Step>('loading')
const setup = ref<TwoFactorSetup | null>(null)
const code = ref('')
const error = ref('')
const submitting = ref(false)
const recoveryCodes = ref<string[]>([])

async function startSetup() {
  step.value = 'loading'
  error.value = ''
  code.value = ''
  setup.value = await useApiFetch<TwoFactorSetup>('/api/dashboard/account/two-factor/setup', { method: 'POST' })
  step.value = 'qr'
}

watch(() => props.open, (isOpen) => {
  if (isOpen) startSetup()
})

async function submitCode() {
  if (code.value.length < 6) return
  submitting.value = true
  error.value = ''
  try {
    const result = await useApiFetch<TwoFactorConfirmResult>('/api/dashboard/account/two-factor/confirm', {
      method: 'POST',
      body: { code: code.value },
    })
    recoveryCodes.value = result.recoveryCodes
    step.value = 'recovery-codes'
  }
  catch {
    error.value = t('dashboard.settings.security.twoFactorSetup.invalidCode')
  }
  finally {
    submitting.value = false
  }
}

function finish() {
  emit('enabled')
  emit('close')
}
</script>

<template>
  <UiModal
    :open="open"
    :labelledby="titleId"
    @close="emit('close')"
  >
    <p
      v-if="step === 'loading'"
      class="py-8 text-center text-sm text-black/50 dark:text-white/50"
    >
      {{ t('dashboard.settings.security.twoFactorSetup.loading') }}
    </p>

    <template v-else-if="step === 'qr'">
      <h2
        :id="titleId"
        class="mb-2 font-display text-xl font-bold"
      >
        {{ t('dashboard.settings.security.twoFactorSetup.heading') }}
      </h2>
      <p class="mb-4 text-sm text-black/60 dark:text-white/60">
        {{ t('dashboard.settings.security.twoFactorSetup.body') }}
      </p>
      <!-- eslint-disable vue/no-v-html -- server-generated SVG from our own trusted TwoFactorController, not user input -->
      <div
        class="mb-4 flex justify-center rounded-xl border border-black/10 bg-white p-3 dark:border-white/10"
        v-html="setup?.qrCodeSvg"
      />
      <!-- eslint-enable vue/no-v-html -->
      <p class="mb-4 text-center text-xs text-black/50 dark:text-white/50">
        {{ t('dashboard.settings.security.twoFactorSetup.manualEntry') }}
        <code class="font-mono font-semibold text-black dark:text-white">{{ setup?.secret }}</code>
      </p>
      <form
        class="flex flex-col gap-3"
        @submit.prevent="submitCode"
      >
        <UiInput
          v-model="code"
          autocomplete="one-time-code"
          :placeholder="t('auth.twoFactor.codePlaceholder')"
        />
        <p
          v-if="error"
          class="text-xs font-semibold text-red-600 dark:text-red-400"
        >
          {{ error }}
        </p>
        <div class="flex justify-end gap-2.5">
          <UiButton
            type="button"
            variant="ghost"
            @click="emit('close')"
          >
            {{ t('dashboard.services.form.cancel') }}
          </UiButton>
          <UiButton
            type="submit"
            variant="primary"
            :disabled="code.length < 6 || submitting"
          >
            {{ t('dashboard.settings.security.twoFactorSetup.verify') }}
          </UiButton>
        </div>
      </form>
    </template>

    <template v-else-if="step === 'recovery-codes'">
      <h2
        :id="titleId"
        class="mb-2 font-display text-xl font-bold"
      >
        {{ t('dashboard.settings.security.twoFactorSetup.recoveryHeading') }}
      </h2>
      <p class="mb-4 text-sm text-black/60 dark:text-white/60">
        {{ t('dashboard.settings.security.twoFactorSetup.recoveryBody') }}
      </p>
      <div class="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-black/10 bg-black/5 p-4 font-mono text-sm dark:border-white/10 dark:bg-white/5">
        <span
          v-for="recoveryCode in recoveryCodes"
          :key="recoveryCode"
        >{{ recoveryCode }}</span>
      </div>
      <UiButton
        class="w-full justify-center"
        @click="finish"
      >
        {{ t('dashboard.settings.security.twoFactorSetup.done') }}
      </UiButton>
    </template>
  </UiModal>
</template>
