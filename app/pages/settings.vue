<script setup lang="ts">
import type { AccountSettings } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useI18n()

const { data: account } = await useApi<AccountSettings>('/dashboard/account', {
  key: 'dashboard-account',
})

const twoFa = ref(false)
const bookingRequests = ref(true)
const paymentsPayouts = ref(true)
const messages = ref(true)
const marketing = ref(false)

watch(account, (value) => {
  if (!value) return
  twoFa.value = value.twoFactorEnabled
  bookingRequests.value = value.notificationPreferences.bookingRequests
  paymentsPayouts.value = value.notificationPreferences.paymentsPayouts
  messages.value = value.notificationPreferences.messages
  marketing.value = value.notificationPreferences.marketing
}, { immediate: true })

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
        <h2 class="mb-1 font-display text-[15px] font-bold">
          {{ t('dashboard.settings.account.heading') }}
        </h2>
        <div class="flex items-center justify-between gap-4 border-b border-black/10 py-3.5 dark:border-white/10">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.account.fullName') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ account.fullName }}
            </div>
          </div>
          <NuxtLinkLocale
            to="/profile"
            :class="linkButtonClass('ghost', 'sm')"
          >
            {{ t('dashboard.settings.account.editProfile') }}
          </NuxtLinkLocale>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-black/10 py-3.5 dark:border-white/10">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.account.email') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ account.email }}
            </div>
          </div>
          <UiButton
            variant="ghost"
            size="sm"
          >
            {{ t('dashboard.settings.account.change') }}
          </UiButton>
        </div>
        <div class="flex items-center justify-between gap-4 py-3.5">
          <div>
            <div class="text-[13.5px] font-semibold">
              {{ t('dashboard.settings.account.phone') }}
            </div>
            <div class="mt-0.5 text-[13px] text-black/60 dark:text-white/60">
              {{ account.phone }}
            </div>
          </div>
          <UiButton
            variant="ghost"
            size="sm"
          >
            {{ t('dashboard.settings.account.change') }}
          </UiButton>
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
              {{ t('dashboard.settings.security.passwordChanged', { time: account.passwordChangedLabel }) }}
            </div>
          </div>
          <UiButton
            variant="ghost"
            size="sm"
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
            {{ t('dashboard.settings.notifications.paymentsPayouts') }}
          </div>
          <UiToggleSwitch
            v-model="paymentsPayouts"
            :label="t('dashboard.settings.notifications.paymentsPayouts')"
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
        <div class="mb-1 flex items-center justify-between">
          <h2 class="font-display text-[15px] font-bold">
            {{ t('dashboard.settings.payment.heading') }}
          </h2>
          <UiButton
            variant="ghost"
            size="sm"
          >
            <UiIcon
              name="plus"
              :size="13"
            />{{ t('dashboard.settings.payment.addMethod') }}
          </UiButton>
        </div>
        <div
          v-for="(method, index) in account.paymentMethods"
          :key="method.id"
          class="flex items-center justify-between gap-4 py-3.5"
          :class="index < account.paymentMethods.length - 1 && 'border-b border-black/10 dark:border-white/10'"
        >
          <div class="flex items-center gap-3">
            <span class="flex h-7 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-[10px] font-extrabold text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
              {{ method.brand === 'visa' ? 'VISA' : 'MC' }}
            </span>
            <div>
              <div class="text-[13.5px] font-semibold">
                {{ method.brand === 'visa' ? 'Visa' : 'Mastercard' }} •••• {{ method.last4 }}
              </div>
              <div class="mt-0.5 text-xs text-black/60 dark:text-white/60">
                {{ t('dashboard.settings.payment.expires', { date: method.expiry }) }}
              </div>
            </div>
            <UiTag
              v-if="method.isDefault"
              variant="primary"
              size="sm"
            >
              {{ t('dashboard.settings.payment.default') }}
            </UiTag>
          </div>
          <div class="flex gap-2">
            <UiButton
              v-if="!method.isDefault"
              variant="ghost"
              size="sm"
            >
              {{ t('dashboard.settings.payment.makeDefault') }}
            </UiButton>
            <UiButton
              variant="ghost"
              size="sm"
            >
              {{ t('dashboard.settings.payment.remove') }}
            </UiButton>
          </div>
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
          >
            {{ t('dashboard.settings.danger.delete') }}
          </button>
        </div>
      </section>
    </template>
  </div>
</template>
