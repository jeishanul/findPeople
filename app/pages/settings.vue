<script setup lang="ts">
import type { AccountSettings } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()
const session = useSession()
const localePath = useLocalePath()

const { data: account } = await useApi<AccountSettings>('/dashboard/account', {
  key: 'dashboard-account',
})

const twoFa = ref(false)
const bookingRequests = ref(true)
const messages = ref(true)
const marketing = ref(false)

watch(account, (value) => {
  if (!value) return
  twoFa.value = value.twoFactorEnabled
  bookingRequests.value = value.notificationPreferences.bookingRequests
  messages.value = value.notificationPreferences.messages
  marketing.value = value.notificationPreferences.marketing
}, { immediate: true })

// --- Change password — mock only, no backend (see CLAUDE.md) --------------

const isPasswordModalOpen = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const passwordJustChanged = ref(false)

const canChangePassword = computed(() => newPassword.value.length >= 8 && newPassword.value === confirmPassword.value)

function openChangePassword() {
  newPassword.value = ''
  confirmPassword.value = ''
  isPasswordModalOpen.value = true
}

function submitChangePassword() {
  if (!canChangePassword.value) return
  isPasswordModalOpen.value = false
  passwordJustChanged.value = true
  setTimeout(() => (passwordJustChanged.value = false), 2500)
}

// --- Deactivate / delete account — destructive, so both are gated behind a
// confirmation dialog rather than firing on a single click. Neither backend
// action exists (mock data only), so confirming just logs the mock session
// out, which is the closest honest equivalent to "this account is gone".

const dangerAction = ref<'deactivate' | 'delete' | null>(null)

function confirmDangerAction() {
  dangerAction.value = null
  session.logout()
  navigateTo(localePath('/'))
}

useSeoMeta({
  title: t('dashboard.settings.title'),
})
</script>

<template>
  <div class="flex max-w-2xl flex-col gap-6">
    <div>
      <h1 class="font-display text-2xl font-bold">
        {{ t('dashboard.settings.title') }}
      </h1>
      <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
        {{ t('dashboard.settings.subtitle') }}
      </p>
    </div>

    <template v-if="account">
      <section class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div class="mb-1 flex items-center justify-between gap-4">
          <h2 class="font-display text-[15px] font-bold">
            {{ t('dashboard.settings.account.heading') }}
          </h2>
          <NuxtLinkLocale
            to="/profile"
            :class="linkButtonClass('ghost', 'sm')"
          >
            {{ t('dashboard.settings.account.editProfile') }}
          </NuxtLinkLocale>
        </div>
        <p class="mb-3.5 text-xs text-black/50 dark:text-white/50">
          {{ t('dashboard.settings.account.editHint') }}
        </p>
        <div class="flex flex-col gap-3.5 py-1">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.account.fullName') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ account.fullName }}
            </div>
          </div>
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.account.email') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ account.email }}
            </div>
          </div>
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.account.phone') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ account.phone }}
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 class="mb-1 font-display text-[15px] font-bold">
          {{ t('dashboard.settings.security.heading') }}
        </h2>
        <div class="flex items-center justify-between gap-4 border-b border-black/10 py-3.5 dark:border-white/10">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.security.password') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              <span
                v-if="passwordJustChanged"
                class="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-100"
              >
                <UiIcon
                  name="check"
                  :size="12"
                />{{ t('dashboard.settings.security.passwordUpdated') }}
              </span>
              <template v-else>
                {{ t('dashboard.settings.security.passwordChanged', { time: account.passwordChangedLabel }) }}
              </template>
            </div>
          </div>
          <UiButton
            variant="ghost"
            size="sm"
            @click="openChangePassword"
          >
            {{ t('dashboard.settings.security.changePassword') }}
          </UiButton>
        </div>
        <div class="flex items-center justify-between gap-4 py-3.5">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.security.twoFa') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ t('dashboard.settings.security.twoFaBody') }}
            </div>
          </div>
          <UiToggleSwitch
            v-model="twoFa"
            :label="t('dashboard.settings.security.twoFa')"
          />
        </div>
      </section>

      <section class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 class="mb-1 font-display text-[15px] font-bold">
          {{ t('dashboard.settings.notifications.heading') }}
        </h2>
        <div class="flex items-center justify-between gap-4 border-b border-black/10 py-3.5 dark:border-white/10">
          <div class="text-[13.5px] font-semibold">
            {{ t('dashboard.settings.notifications.bookingRequests') }}
          </div>
          <UiToggleSwitch
            v-model="bookingRequests"
            :label="t('dashboard.settings.notifications.bookingRequests')"
          />
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-black/10 py-3.5 dark:border-white/10">
          <div class="text-[13.5px] font-semibold">
            {{ t('dashboard.settings.notifications.messages') }}
          </div>
          <UiToggleSwitch
            v-model="messages"
            :label="t('dashboard.settings.notifications.messages')"
          />
        </div>
        <div class="flex items-center justify-between gap-4 py-3.5">
          <div class="text-[13.5px] font-semibold">
            {{ t('dashboard.settings.notifications.marketing') }}
          </div>
          <UiToggleSwitch
            v-model="marketing"
            :label="t('dashboard.settings.notifications.marketing')"
          />
        </div>
      </section>

      <section class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 class="mb-1 font-display text-[15px] font-bold">
          {{ t('dashboard.settings.language.heading') }}
        </h2>
        <div class="flex items-center justify-between gap-4 py-3.5">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.language.current') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              English (United States)
            </div>
          </div>
          <UiLocaleSwitcher />
        </div>
      </section>

      <section class="rounded-2xl border border-red-600/30 p-6">
        <h2 class="mb-1 font-display text-[15px] font-bold text-red-700 dark:text-red-300">
          {{ t('dashboard.settings.danger.heading') }}
        </h2>
        <div class="flex items-center justify-between gap-4 border-b border-black/10 py-3.5 dark:border-white/10">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.danger.deactivate') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ t('dashboard.settings.danger.deactivateBody') }}
            </div>
          </div>
          <button
            type="button"
            class="rounded-md border border-red-600/40 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
            @click="dangerAction = 'deactivate'"
          >
            {{ t('dashboard.settings.danger.deactivate') }}
          </button>
        </div>
        <div class="flex items-center justify-between gap-4 py-3.5">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.danger.delete') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ t('dashboard.settings.danger.deleteBody') }}
            </div>
          </div>
          <button
            type="button"
            class="rounded-md border border-red-600/40 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
            @click="dangerAction = 'delete'"
          >
            {{ t('dashboard.settings.danger.delete') }}
          </button>
        </div>
      </section>
    </template>

    <UiModal
      :open="isPasswordModalOpen"
      @close="isPasswordModalOpen = false"
    >
      <h2 class="mb-5 font-display text-xl font-bold">
        {{ t('dashboard.settings.security.changePassword') }}
      </h2>
      <form
        class="flex flex-col gap-4"
        @submit.prevent="submitChangePassword"
      >
        <div>
          <label
            for="settings-new-password"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('dashboard.settings.security.newPasswordLabel') }}</label>
          <UiInput
            id="settings-new-password"
            v-model="newPassword"
            type="password"
          />
        </div>
        <div>
          <label
            for="settings-confirm-password"
            class="mb-1.5 block text-xs font-bold"
          >{{ t('dashboard.settings.security.confirmPasswordLabel') }}</label>
          <UiInput
            id="settings-confirm-password"
            v-model="confirmPassword"
            type="password"
          />
        </div>
        <div class="mt-1 flex justify-end gap-2.5">
          <UiButton
            type="button"
            variant="ghost"
            @click="isPasswordModalOpen = false"
          >
            {{ t('dashboard.services.form.cancel') }}
          </UiButton>
          <UiButton
            type="submit"
            variant="primary"
            :disabled="!canChangePassword"
          >
            {{ t('dashboard.settings.security.updatePassword') }}
          </UiButton>
        </div>
      </form>
    </UiModal>

    <UiModal
      :open="dangerAction !== null"
      @close="dangerAction = null"
    >
      <h2 class="mb-2 font-display text-xl font-bold">
        {{ dangerAction === 'delete' ? t('dashboard.settings.danger.confirmDeleteTitle') : t('dashboard.settings.danger.confirmDeactivateTitle') }}
      </h2>
      <p class="mb-5 text-sm text-black/60 dark:text-white/60">
        {{ dangerAction === 'delete' ? t('dashboard.settings.danger.confirmDeleteBody') : t('dashboard.settings.danger.confirmDeactivateBody') }}
      </p>
      <div class="flex justify-end gap-2.5">
        <UiButton
          variant="ghost"
          @click="dangerAction = null"
        >
          {{ t('dashboard.services.form.cancel') }}
        </UiButton>
        <UiButton
          class="bg-red-600! hover:bg-red-700!"
          @click="confirmDangerAction"
        >
          {{ dangerAction === 'delete' ? t('dashboard.settings.danger.delete') : t('dashboard.settings.danger.deactivate') }}
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>
