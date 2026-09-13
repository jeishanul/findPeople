<script setup lang="ts">
// Auto-imported as <MarketplaceAuthModal />. Mounted once, site-wide, in
// `layouts/default.vue` — every "Log in" / "Sign up" / "Message" control
// anywhere in the app opens this same instance via `useAuthModal()`.
// UI-only: there's no auth backend yet, so every form prevents the page
// reload on submit and stops there (see CLAUDE.md — a real submit endpoint
// needs `security.csrf` turned on at the same time, not bolted on after).
// The password-reset flow (forgot-password → otp → reset-password) is a
// client-only simulation for the same reason: the OTP is never checked
// against anything real, "resend" just restarts the local timer, and
// "reset" only validates the two password fields against each other.
const { t } = useI18n()
const authModal = useAuthModal()

const titleId = useId()

const login = reactive({ identifier: '', password: '' })
const register = reactive({ fullName: '', email: '', password: '' })
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const tabButtonClass = (tab: 'login' | 'register') => [
  'rounded-full px-5 py-2.5 text-sm font-bold transition-colors',
  authModal.view.value === tab
    ? 'bg-brand-600 text-white'
    : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white',
]
const isAuthTab = computed(() => authModal.view.value === 'login' || authModal.view.value === 'register')

// --- Forgot password → OTP → reset password -------------------------------

const forgotEmail = ref('')
const otpCode = ref('')
const resetPassword = reactive({ password: '', confirmPassword: '' })
const showResetPassword = ref(false)
const showResetConfirmPassword = ref(false)
const resetError = ref('')
const resetSuccess = ref(false)

const RESEND_SECONDS = 45
const countdown = useCountdown(RESEND_SECONDS)
const countdownLabel = computed(() => {
  const total = countdown.remaining.value
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

type BackStep = 'login' | 'forgot-password' | 'otp'
const backTarget = computed<BackStep | null>(() => {
  switch (authModal.view.value) {
    case 'forgot-password': return 'login'
    case 'otp': return 'forgot-password'
    // Going "back" from the success screen would re-open a code that's
    // already served its purpose — only offer it during the input step.
    case 'reset-password': return resetSuccess.value ? null : 'otp'
    default: return null
  }
})

function goBack() {
  if (backTarget.value) authModal.setView(backTarget.value)
}

function goToForgotPassword() {
  forgotEmail.value = login.identifier.includes('@') ? login.identifier : ''
  authModal.setView('forgot-password')
}

function goToChangeEmail() {
  forgotEmail.value = authModal.resetEmail.value
  authModal.setView('forgot-password')
}

function handleForgotPasswordSubmit() {
  authModal.setResetEmail(forgotEmail.value)
  otpCode.value = ''
  authModal.setView('otp')
  countdown.start()
}

function handleResend() {
  if (countdown.isActive.value) return
  otpCode.value = ''
  countdown.start()
}

function handleOtpSubmit() {
  if (otpCode.value.length !== 6) return
  resetError.value = ''
  resetSuccess.value = false
  resetPassword.password = ''
  resetPassword.confirmPassword = ''
  authModal.setView('reset-password')
}

function handleResetPasswordSubmit() {
  if (resetPassword.password.length < 8) {
    resetError.value = t('auth.resetPassword.tooShortError')
    return
  }
  if (resetPassword.password !== resetPassword.confirmPassword) {
    resetError.value = t('auth.resetPassword.mismatchError')
    return
  }
  resetError.value = ''
  resetSuccess.value = true
}

function continueToLogin() {
  resetSuccess.value = false
  authModal.setView('login')
}

function handleSubmit() {
  // No backend to call yet — see the note above.
}
</script>

<template>
  <UiModal
    :open="authModal.isOpen.value"
    :labelledby="titleId"
    @close="authModal.close()"
  >
    <button
      v-if="backTarget"
      type="button"
      class="absolute top-[18px] left-[18px] flex h-9 w-9 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
      :aria-label="t('auth.back')"
      @click="goBack"
    >
      <UiIcon
        name="arrow-right"
        :size="18"
        class="rotate-180"
      />
    </button>

    <button
      type="button"
      class="absolute top-[18px] right-[18px] flex h-9 w-9 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
      :aria-label="t('auth.close')"
      @click="authModal.close()"
    >
      <UiIcon
        name="x"
        :size="18"
      />
    </button>

    <div
      v-if="isAuthTab"
      class="mb-7 flex w-fit gap-1 rounded-full bg-black/5 p-1 dark:bg-white/10"
    >
      <button
        type="button"
        :class="tabButtonClass('login')"
        @click="authModal.setView('login')"
      >
        {{ t('auth.tabs.login') }}
      </button>
      <button
        type="button"
        :class="tabButtonClass('register')"
        @click="authModal.setView('register')"
      >
        {{ t('auth.tabs.register') }}
      </button>
    </div>
    <div
      v-else-if="backTarget"
      class="mb-7 h-9"
    />

    <template v-if="authModal.view.value === 'login'">
      <h2
        :id="titleId"
        class="text-2xl font-bold"
      >
        {{ t('auth.login.heading') }}
      </h2>
      <p class="mt-1.5 text-sm text-black/60 dark:text-white/60">
        {{ t('auth.login.subheading') }}
      </p>

      <form
        class="mt-6 flex flex-col gap-4"
        @submit.prevent="handleSubmit"
      >
        <div>
          <label
            for="auth-login-identifier"
            class="mb-2 block text-xs font-bold"
          >{{ t('auth.login.identifierLabel') }}</label>
          <UiInput
            id="auth-login-identifier"
            v-model="login.identifier"
            icon="user"
            autocomplete="username"
            :placeholder="t('auth.login.identifierPlaceholder')"
          />
        </div>
        <div>
          <label
            for="auth-login-password"
            class="mb-2 block text-xs font-bold"
          >{{ t('auth.login.passwordLabel') }}</label>
          <UiInput
            id="auth-login-password"
            v-model="login.password"
            icon="lock"
            :type="showLoginPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :placeholder="t('auth.login.passwordPlaceholder')"
          >
            <template #trailing>
              <button
                type="button"
                class="shrink-0 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
                :aria-label="showLoginPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                @click="showLoginPassword = !showLoginPassword"
              >
                <UiIcon
                  :name="showLoginPassword ? 'eye-off' : 'eye'"
                  :size="17"
                />
              </button>
            </template>
          </UiInput>
        </div>

        <div class="-mt-1 flex items-center justify-between">
          <label
            for="auth-login-remember"
            class="flex items-center gap-2 text-xs text-black/60 dark:text-white/60"
          >
            <input
              id="auth-login-remember"
              type="checkbox"
              class="h-[15px] w-[15px] accent-brand-600"
            >
            {{ t('auth.login.rememberMe') }}
          </label>
          <button
            type="button"
            class="text-xs font-semibold"
            @click="goToForgotPassword"
          >
            {{ t('auth.login.forgotPassword') }}
          </button>
        </div>

        <UiButton
          type="submit"
          class="mt-1.5 h-[46px] w-full justify-center rounded-xl!"
        >
          {{ t('auth.login.submit') }}
        </UiButton>
      </form>

      <p class="mt-5 text-center text-sm text-black/60 dark:text-white/60">
        {{ t('auth.login.switchPrompt') }}
        <button
          type="button"
          class="font-bold text-black dark:text-white"
          @click="authModal.setView('register')"
        >
          {{ t('auth.login.switchAction') }}
        </button>
      </p>
    </template>

    <template v-else-if="authModal.view.value === 'register'">
      <h2
        :id="titleId"
        class="text-2xl font-bold"
      >
        {{ t('auth.register.heading') }}
      </h2>
      <p class="mt-1.5 text-sm text-black/60 dark:text-white/60">
        {{ t('auth.register.subheading') }}
      </p>

      <form
        class="mt-6 flex flex-col gap-4"
        @submit.prevent="handleSubmit"
      >
        <div>
          <label
            for="auth-register-name"
            class="mb-2 block text-xs font-bold"
          >{{ t('auth.register.fullNameLabel') }}</label>
          <UiInput
            id="auth-register-name"
            v-model="register.fullName"
            icon="user"
            autocomplete="name"
            :placeholder="t('auth.register.fullNamePlaceholder')"
          />
        </div>
        <div>
          <label
            for="auth-register-email"
            class="mb-2 block text-xs font-bold"
          >{{ t('auth.register.emailLabel') }}</label>
          <UiInput
            id="auth-register-email"
            v-model="register.email"
            type="email"
            icon="mail"
            autocomplete="email"
            :placeholder="t('auth.register.emailPlaceholder')"
          />
        </div>
        <div>
          <label
            for="auth-register-password"
            class="mb-2 block text-xs font-bold"
          >{{ t('auth.register.passwordLabel') }}</label>
          <UiInput
            id="auth-register-password"
            v-model="register.password"
            icon="lock"
            :type="showRegisterPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :placeholder="t('auth.register.passwordPlaceholder')"
          >
            <template #trailing>
              <button
                type="button"
                class="shrink-0 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
                :aria-label="showRegisterPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                @click="showRegisterPassword = !showRegisterPassword"
              >
                <UiIcon
                  :name="showRegisterPassword ? 'eye-off' : 'eye'"
                  :size="17"
                />
              </button>
            </template>
          </UiInput>
        </div>

        <label
          for="auth-register-terms"
          class="-mt-1 flex items-start gap-2 text-xs text-black/60 dark:text-white/60"
        >
          <input
            id="auth-register-terms"
            type="checkbox"
            class="mt-0.5 h-[15px] w-[15px] shrink-0 accent-brand-600"
          >
          <i18n-t
            keypath="auth.register.terms"
            tag="span"
            class="leading-relaxed"
          >
            <template #tos>
              <a
                href="#"
                class="font-semibold"
              >{{ t('auth.register.termsTos') }}</a>
            </template>
            <template #privacy>
              <a
                href="#"
                class="font-semibold"
              >{{ t('auth.register.termsPrivacy') }}</a>
            </template>
          </i18n-t>
        </label>

        <UiButton
          type="submit"
          class="mt-1.5 h-[46px] w-full justify-center rounded-xl!"
        >
          {{ t('auth.register.submit') }}
        </UiButton>
      </form>

      <p class="mt-5 text-center text-sm text-black/60 dark:text-white/60">
        {{ t('auth.register.switchPrompt') }}
        <button
          type="button"
          class="font-bold text-black dark:text-white"
          @click="authModal.setView('login')"
        >
          {{ t('auth.register.switchAction') }}
        </button>
      </p>
    </template>

    <template v-else-if="authModal.view.value === 'forgot-password'">
      <h2
        :id="titleId"
        class="text-2xl font-bold"
      >
        {{ t('auth.forgotPassword.heading') }}
      </h2>
      <p class="mt-1.5 text-sm text-black/60 dark:text-white/60">
        {{ t('auth.forgotPassword.subheading') }}
      </p>

      <form
        class="mt-6 flex flex-col gap-4"
        @submit.prevent="handleForgotPasswordSubmit"
      >
        <div>
          <label
            for="auth-forgot-email"
            class="mb-2 block text-xs font-bold"
          >{{ t('auth.forgotPassword.emailLabel') }}</label>
          <UiInput
            id="auth-forgot-email"
            v-model="forgotEmail"
            type="email"
            icon="mail"
            autocomplete="email"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
          />
        </div>

        <UiButton
          type="submit"
          class="mt-1.5 h-[46px] w-full justify-center rounded-xl!"
        >
          {{ t('auth.forgotPassword.submit') }}
        </UiButton>
      </form>

      <p class="mt-5 text-center text-sm">
        <button
          type="button"
          class="font-bold text-black dark:text-white"
          @click="authModal.setView('login')"
        >
          {{ t('auth.forgotPassword.backToLogin') }}
        </button>
      </p>
    </template>

    <template v-else-if="authModal.view.value === 'otp'">
      <h2
        :id="titleId"
        class="text-2xl font-bold"
      >
        {{ t('auth.otp.heading') }}
      </h2>
      <p class="mt-1.5 text-sm text-black/60 dark:text-white/60">
        {{ t('auth.otp.subheading', { email: authModal.resetEmail.value }) }}
        <button
          type="button"
          class="font-semibold text-black hover:underline dark:text-white"
          @click="goToChangeEmail"
        >
          {{ t('auth.otp.changeEmail') }}
        </button>
      </p>

      <form
        class="mt-6 flex flex-col gap-5"
        @submit.prevent="handleOtpSubmit"
      >
        <UiOtpInput
          v-model="otpCode"
          :aria-label="t('auth.otp.codeLabel')"
          class="justify-center"
        />

        <p class="text-center text-xs text-black/60 dark:text-white/60">
          <span v-if="countdown.isActive.value">{{ t('auth.otp.resendCountdown', { time: countdownLabel }) }}</span>
          <button
            v-else
            type="button"
            class="font-bold text-black dark:text-white"
            @click="handleResend"
          >
            {{ t('auth.otp.resend') }}
          </button>
        </p>

        <UiButton
          type="submit"
          class="w-full justify-center"
          :disabled="otpCode.length !== 6"
        >
          {{ t('auth.otp.submit') }}
        </UiButton>
      </form>
    </template>

    <template v-else-if="authModal.view.value === 'reset-password'">
      <template v-if="!resetSuccess">
        <h2
          :id="titleId"
          class="text-2xl font-bold"
        >
          {{ t('auth.resetPassword.heading') }}
        </h2>
        <p class="mt-1.5 text-sm text-black/60 dark:text-white/60">
          {{ t('auth.resetPassword.subheading') }}
        </p>

        <form
          class="mt-6 flex flex-col gap-4"
          @submit.prevent="handleResetPasswordSubmit"
        >
          <div>
            <label
              for="auth-reset-password"
              class="mb-2 block text-xs font-bold"
            >{{ t('auth.resetPassword.newPasswordLabel') }}</label>
            <UiInput
              id="auth-reset-password"
              v-model="resetPassword.password"
              icon="lock"
              :type="showResetPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :placeholder="t('auth.resetPassword.newPasswordPlaceholder')"
            >
              <template #trailing>
                <button
                  type="button"
                  class="shrink-0 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
                  :aria-label="showResetPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                  @click="showResetPassword = !showResetPassword"
                >
                  <UiIcon
                    :name="showResetPassword ? 'eye-off' : 'eye'"
                    :size="17"
                  />
                </button>
              </template>
            </UiInput>
          </div>
          <div>
            <label
              for="auth-reset-confirm-password"
              class="mb-2 block text-xs font-bold"
            >{{ t('auth.resetPassword.confirmPasswordLabel') }}</label>
            <UiInput
              id="auth-reset-confirm-password"
              v-model="resetPassword.confirmPassword"
              icon="lock"
              :type="showResetConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :placeholder="t('auth.resetPassword.confirmPasswordPlaceholder')"
            >
              <template #trailing>
                <button
                  type="button"
                  class="shrink-0 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
                  :aria-label="showResetConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                  @click="showResetConfirmPassword = !showResetConfirmPassword"
                >
                  <UiIcon
                    :name="showResetConfirmPassword ? 'eye-off' : 'eye'"
                    :size="17"
                  />
                </button>
              </template>
            </UiInput>
          </div>

          <p
            v-if="resetError"
            class="-mt-1 text-xs font-semibold text-red-600 dark:text-red-400"
          >
            {{ resetError }}
          </p>

          <UiButton
            type="submit"
            class="mt-1.5 h-[46px] w-full justify-center rounded-xl!"
          >
            {{ t('auth.resetPassword.submit') }}
          </UiButton>
        </form>
      </template>

      <template v-else>
        <div class="flex flex-col items-center py-2 text-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
            <UiIcon
              name="check"
              :size="26"
            />
          </div>
          <h2
            :id="titleId"
            class="mt-4 text-2xl font-bold"
          >
            {{ t('auth.resetPassword.successHeading') }}
          </h2>
          <p class="mt-1.5 text-sm text-black/60 dark:text-white/60">
            {{ t('auth.resetPassword.successBody') }}
          </p>
          <UiButton
            class="mt-6 w-full justify-center"
            @click="continueToLogin"
          >
            {{ t('auth.resetPassword.continueToLogin') }}
          </UiButton>
        </div>
      </template>
    </template>

    <template v-if="isAuthTab">
      <div class="my-6 flex items-center gap-3">
        <div class="h-px flex-1 bg-black/10 dark:bg-white/10" />
        <span class="text-xs text-black/50 dark:text-white/50">{{ t('auth.social.divider') }}</span>
        <div class="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <div class="flex flex-col gap-2.5">
        <button
          type="button"
          class="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <UiIcon
            name="google"
            filled
            :size="18"
          />
          {{ t('auth.social.google') }}
        </button>
        <button
          type="button"
          class="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white text-sm font-semibold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <UiIcon
            name="facebook"
            filled
            :size="18"
          />
          {{ t('auth.social.facebook') }}
        </button>
      </div>
    </template>
  </UiModal>
</template>
