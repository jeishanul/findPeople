<script setup lang="ts">
import type { DashboardSummary, ProviderProfileDetail } from '#shared/types/dashboard'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t, locale } = useI18n()

const { data: profile } = await useApi<ProviderProfileDetail>('/dashboard/profile', {
  key: 'dashboard-profile',
})
const { data: summary } = await useApi<DashboardSummary>('/dashboard/summary', {
  key: 'dashboard-summary-provider',
  query: { role: 'provider' },
})

// The active tab lives in the URL (`?tab=kyc`), not local state, so the
// sidebar's "Verification" link can both open this tab directly and know
// when to highlight itself instead of "My profile" — see `layouts/dashboard.vue`.
const route = useRoute()
const router = useRouter()

const activeTab = computed<'details' | 'kyc'>(() => (route.query.tab === 'kyc' ? 'kyc' : 'details'))

function setTab(tab: 'details' | 'kyc') {
  const query = { ...route.query }
  if (tab === 'kyc') query.tab = 'kyc'
  else delete query.tab
  router.replace({ query })
}

// Editable copy of the fetched profile — there's no save endpoint yet (see
// CLAUDE.md / MarketplaceAuthModal for the same "UI-only" pattern), so
// "Save changes" just re-syncs this local copy and "Cancel" discards edits.
const form = reactive({
  fullName: '',
  headline: '',
  bio: '',
  phone: '',
  serviceArea: '',
  hourlyRateUsd: 0,
  minVisitFeeUsd: 0,
})

function syncFormFromProfile() {
  if (!profile.value) return
  form.fullName = profile.value.fullName
  form.headline = profile.value.headline
  form.bio = profile.value.bio
  form.phone = profile.value.phone
  form.serviceArea = profile.value.serviceArea
  form.hourlyRateUsd = profile.value.hourlyRateUsd
  form.minVisitFeeUsd = profile.value.minVisitFeeUsd
}

watch(profile, syncFormFromProfile, { immediate: true })

const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
const availableDays = ref<string[]>([])
watch(profile, (value) => {
  if (value) availableDays.value = [...value.availableDays]
}, { immediate: true })

function toggleDay(day: string) {
  availableDays.value = availableDays.value.includes(day)
    ? availableDays.value.filter(d => d !== day)
    : [...availableDays.value, day]
}

const memberSinceLabel = computed(() => {
  if (!profile.value) return ''
  return new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' }).format(new Date(profile.value.memberSince))
})

useSeoMeta({
  title: t('dashboard.profile.title'),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold">
          {{ t('dashboard.profile.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-black/60 dark:text-white/60">
          {{ t('dashboard.profile.subtitle') }}
        </p>
      </div>
    </div>

    <div class="flex gap-7 border-b border-black/10 dark:border-white/10">
      <button
        type="button"
        class="border-b-2 pb-3 text-sm font-bold transition-colors"
        :class="activeTab === 'details' ? 'border-brand-600 text-black dark:text-white' : 'border-transparent text-black/40 dark:text-white/40'"
        @click="setTab('details')"
      >
        {{ t('dashboard.profile.tabs.details') }}
      </button>
      <button
        type="button"
        class="border-b-2 pb-3 text-sm font-bold transition-colors"
        :class="activeTab === 'kyc' ? 'border-brand-600 text-black dark:text-white' : 'border-transparent text-black/40 dark:text-white/40'"
        @click="setTab('kyc')"
      >
        {{ t('dashboard.profile.tabs.kyc') }}
      </button>
    </div>

    <div
      v-if="activeTab === 'details' && profile"
      class="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]"
    >
      <div class="flex flex-col items-center gap-3.5 rounded-2xl border border-black/10 p-6 text-center dark:border-white/10">
        <span class="flex h-24 w-24 items-center justify-center rounded-full bg-brand-600 font-display text-3xl font-bold text-white">
          {{ initialsFor(profile.fullName) }}
        </span>
        <UiButton variant="ghost">
          <UiIcon
            name="camera"
            :size="15"
          />{{ t('dashboard.profile.changePhoto') }}
        </UiButton>
        <div class="w-full space-y-2 border-t border-black/10 pt-3.5 text-left dark:border-white/10">
          <div class="flex items-center gap-2 text-[13px] text-black/60 dark:text-white/60">
            <UiIcon
              name="star"
              filled
              :size="15"
              class="text-accent-600"
            />
            {{ t('dashboard.profile.ratingSummary', { rating: profile.averageRating.toFixed(1), count: profile.reviewCount }) }}
          </div>
          <div class="flex items-center gap-2 text-[13px] text-black/60 dark:text-white/60">
            <UiIcon
              name="users"
              :size="15"
            />
            {{ t('dashboard.profile.clientsServedSummary', { count: profile.clientsServed }) }}
          </div>
          <div class="flex items-center gap-2 text-[13px] text-black/60 dark:text-white/60">
            <UiIcon
              name="calendar"
              :size="15"
            />
            {{ t('dashboard.profile.memberSince', { date: memberSinceLabel }) }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 class="mb-4 font-display text-[15px] font-bold">
            {{ t('dashboard.profile.sections.basicInfo') }}
          </h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                for="profile-full-name"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.fullName') }}</label>
              <UiInput
                id="profile-full-name"
                v-model="form.fullName"
              />
            </div>
            <div>
              <label
                for="profile-headline"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.headline') }}</label>
              <UiInput
                id="profile-headline"
                v-model="form.headline"
              />
            </div>
            <div class="sm:col-span-2">
              <label
                for="profile-bio"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.bio') }}</label>
              <textarea
                id="profile-bio"
                v-model="form.bio"
                rows="3"
                class="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div>
              <label
                for="profile-phone"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.phone') }}</label>
              <UiInput
                id="profile-phone"
                v-model="form.phone"
                type="tel"
              />
            </div>
            <div>
              <label
                for="profile-email"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.email') }}</label>
              <UiInput
                id="profile-email"
                :model-value="profile.email"
                type="email"
                disabled
                class="opacity-60"
              />
            </div>
            <div class="sm:col-span-2">
              <label
                for="profile-service-area"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.serviceArea') }}</label>
              <UiInput
                id="profile-service-area"
                v-model="form.serviceArea"
                icon="map-pin"
              />
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 class="mb-4 font-display text-[15px] font-bold">
            {{ t('dashboard.profile.sections.skills') }}
          </h2>
          <div class="flex flex-wrap items-center gap-2">
            <UiTag
              v-for="categoryId in profile.categoryIds"
              :key="categoryId"
              variant="primary"
            >
              {{ t(`marketplace.categories.${categoryId}.label`) }}
            </UiTag>
            <UiButton
              variant="ghost"
              size="sm"
            >
              <UiIcon
                name="plus"
                :size="13"
              />{{ t('dashboard.profile.addSkill') }}
            </UiButton>
          </div>
        </div>

        <div class="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 class="mb-4 font-display text-[15px] font-bold">
            {{ t('dashboard.profile.sections.rateAvailability') }}
          </h2>
          <div class="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                for="profile-hourly-rate"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.hourlyRate') }}</label>
              <UiInput
                id="profile-hourly-rate"
                :model-value="`$${form.hourlyRateUsd}`"
                @update:model-value="(v) => (form.hourlyRateUsd = Number(v.replace(/\D/g, '')) || 0)"
              />
            </div>
            <div>
              <label
                for="profile-min-visit-fee"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.minVisitFee') }}</label>
              <UiInput
                id="profile-min-visit-fee"
                :model-value="`$${form.minVisitFeeUsd}`"
                @update:model-value="(v) => (form.minVisitFeeUsd = Number(v.replace(/\D/g, '')) || 0)"
              />
            </div>
            <div>
              <label
                for="profile-response-time"
                class="mb-2 block text-xs font-bold"
              >{{ t('dashboard.profile.fields.responseTime') }}</label>
              <UiInput
                id="profile-response-time"
                :model-value="`${profile.responseTimeHours}h`"
                disabled
                class="opacity-60"
              />
            </div>
          </div>
          <span class="mb-2 block text-xs font-bold">{{ t('dashboard.profile.fields.availability') }}</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="day in ALL_DAYS"
              :key="day"
              type="button"
              class="rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors"
              :class="availableDays.includes(day)
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100'
                : 'bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40'"
              @click="toggleDay(day)"
            >
              {{ t(`dashboard.days.${day}`) }}
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-2.5">
          <UiButton
            variant="ghost"
            @click="syncFormFromProfile"
          >
            {{ t('dashboard.profile.cancel') }}
          </UiButton>
          <UiButton variant="primary">
            {{ t('dashboard.profile.save') }}
          </UiButton>
        </div>
      </div>
    </div>

    <DashboardKycStepper
      v-else-if="activeTab === 'kyc' && summary"
      :kyc="summary.kyc"
    />
  </div>
</template>
