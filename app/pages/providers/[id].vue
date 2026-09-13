<script setup lang="ts">
import type { ProviderProfile, ServiceCategory } from '#shared/types/marketplace'

const { t } = useI18n()
const route = useRoute()
const authModal = useAuthModal()

const { data: provider, error } = await useApi<ProviderProfile>(`/providers/${route.params.id}`)

if (error.value || !provider.value) {
  throw createError({ statusCode: 404, statusMessage: 'Provider not found', fatal: true })
}

const { data: categories } = await useApi<ServiceCategory[]>('/categories')
const categoryIcon = computed(() => getCategoryIcon(categories.value ?? [], provider.value!.categoryId))
const categoryLabel = computed(() => t(`marketplace.categories.${provider.value!.categoryId}.label`))

const pageTitle = computed(() => t('marketplace.providerProfile.seoTitle', {
  name: provider.value!.name,
  category: categoryLabel.value,
}))

useSeoMeta({
  title: pageTitle,
  description: t('marketplace.providerProfile.seoDescription', { name: provider.value!.name }),
})
defineOgImage('MarketplaceSatori', {
  title: provider.value!.name,
  eyebrow: categoryLabel,
  description: t('marketplace.providerProfile.seoDescription', { name: provider.value!.name }),
})
useSchemaOrg([defineWebPage()])
</script>

<template>
  <div v-if="provider">
    <div class="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-10">
      <div class="h-[220px] w-full overflow-hidden rounded-3xl">
        <UiPlaceholderMedia
          icon="image"
          label="1152 x 220"
        />
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
      <div class="-mt-16 flex flex-col items-start gap-5 pb-6 sm:flex-row sm:items-end">
        <div class="h-[148px] w-[148px] shrink-0 rounded-full border-4 border-white bg-brand-50 text-brand-700 shadow-lg dark:border-black dark:bg-brand-700/20 dark:text-brand-100">
          <UiPlaceholderMedia :icon="categoryIcon" />
        </div>
        <div class="flex-1 pb-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="font-display text-2xl font-bold sm:text-3xl">
              {{ provider.name }}
            </h1>
            <UiTag
              v-if="provider.verified"
              variant="primary"
            >
              <UiIcon
                name="shield-check"
                filled
                :size="12"
              />
              {{ t('marketplace.providerProfile.verifiedPro') }}
            </UiTag>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm text-black/60 dark:text-white/60">
            <span>{{ categoryLabel }}</span>
            <span>&middot;</span>
            <UiRating
              :rating="provider.rating"
              :review-count="provider.reviewCount"
            />
            <span>&middot;</span>
            <span class="inline-flex items-center gap-1">
              <UiIcon
                name="map-pin"
                :size="13"
              />{{ t('marketplace.provider.distanceAway', { distance: provider.distanceKm }) }}
            </span>
          </div>
        </div>
        <div class="flex gap-2.5 pb-2">
          <UiButton
            variant="ghost"
            @click="authModal.open('login')"
          >
            <UiIcon
              name="message"
              :size="16"
            />
            {{ t('marketplace.provider.message') }}
          </UiButton>
          <UiButton
            variant="primary"
            @click="authModal.open('login')"
          >
            {{ t('marketplace.providerProfile.contactProvider') }}
          </UiButton>
        </div>
      </div>

      <div class="mb-10 grid grid-cols-2 gap-4 rounded-2xl border border-black/10 bg-white/70 px-6 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/30 sm:grid-cols-4">
        <div class="text-center sm:border-r sm:border-black/10 sm:dark:border-white/10">
          <p class="font-display text-xl font-bold">
            {{ provider.jobsCompleted }}
          </p>
          <p class="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {{ t('marketplace.providerProfile.stats.jobsCompleted') }}
          </p>
        </div>
        <div class="text-center sm:border-r sm:border-black/10 sm:dark:border-white/10">
          <p class="font-display text-xl font-bold">
            {{ t('marketplace.provider.yearsExperience', { years: provider.yearsExperience }) }}
          </p>
          <p class="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {{ t('marketplace.providerProfile.stats.experience') }}
          </p>
        </div>
        <div class="text-center sm:border-r sm:border-black/10 sm:dark:border-white/10">
          <p class="font-display text-xl font-bold">
            {{ t('marketplace.providerProfile.stats.responseTimeValue', { hours: provider.responseTimeHours }) }}
          </p>
          <p class="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {{ t('marketplace.providerProfile.stats.responseTime') }}
          </p>
        </div>
        <div class="text-center">
          <p class="font-display text-xl font-bold">
            {{ provider.repeatClientPercent }}%
          </p>
          <p class="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {{ t('marketplace.providerProfile.stats.repeatClients') }}
          </p>
        </div>
      </div>

      <div class="grid gap-8 pb-20 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div class="flex flex-col gap-9">
          <div>
            <h2 class="mb-3.5 text-lg font-bold">
              {{ t('marketplace.providerProfile.about') }}
            </h2>
            <p class="text-black/60 dark:text-white/60">
              {{ t(`marketplace.providers.${provider.id}.bio`) }}
            </p>
          </div>

          <div>
            <h2 class="mb-3.5 text-lg font-bold">
              {{ t('marketplace.providerProfile.skills') }}
            </h2>
            <div class="flex flex-wrap gap-2">
              <UiTag
                v-for="skillId in provider.skillIds"
                :key="skillId"
              >
                {{ t(`marketplace.skills.${skillId}`) }}
              </UiTag>
            </div>
          </div>

          <div>
            <h2 class="mb-3.5 text-lg font-bold">
              {{ t('marketplace.providerProfile.recentWork') }}
            </h2>
            <div class="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              <div
                v-for="tile in 6"
                :key="tile"
                class="aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <UiPlaceholderMedia
                  :icon="categoryIcon"
                  :tone="tile % 2 === 0 ? 'accent' : 'primary'"
                  label="380 x 280"
                />
              </div>
            </div>
          </div>

          <div>
            <div class="mb-3.5 flex items-center justify-between">
              <h2 class="text-lg font-bold">
                {{ t('marketplace.providerProfile.reviews', { count: provider.reviewCount }) }}
              </h2>
            </div>
            <div class="flex flex-col gap-3.5">
              <div
                v-for="review in provider.reviews"
                :key="review.id"
                class="rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-black/30"
              >
                <div class="flex items-center gap-2.5">
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
                    <UiIcon
                      name="user"
                      :size="16"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-bold">
                      {{ review.reviewerName }}
                    </p>
                    <div class="flex gap-0.5">
                      <UiIcon
                        v-for="n in review.rating"
                        :key="n"
                        name="star"
                        filled
                        :size="25"
                        class="text-accent-600"
                      />
                    </div>
                  </div>
                  <span class="ml-auto text-xs text-black/40 dark:text-white/40">
                    {{ t('marketplace.providerProfile.postedDaysAgo', { days: review.postedDaysAgo }) }}
                  </span>
                </div>
                <p class="mt-3 text-sm text-black/60 dark:text-white/60">
                  {{ t(`marketplace.reviews.${review.id}.comment`) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
            <div class="flex items-baseline justify-between">
              <p class="font-display text-2xl font-bold">
                ${{ provider.ratePerHour }}<span class="text-sm font-medium text-black/50 dark:text-white/50">{{ t('marketplace.provider.perHour') }}</span>
              </p>
              <span class="text-xs text-black/50 dark:text-white/50">
                {{ t('marketplace.providerProfile.minVisitFee', { fee: provider.minVisitFee }) }}
              </span>
            </div>
            <div class="mt-5 flex flex-col gap-2.5">
              <UiButton variant="primary">
                {{ t('marketplace.providerProfile.contactProvider') }}
              </UiButton>
              <UiButton variant="ghost">
                {{ t('marketplace.providerProfile.requestQuote') }}
              </UiButton>
            </div>
            <div class="mt-5 flex flex-col gap-2.5 border-t border-black/10 pt-5 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
              <p class="flex items-center gap-2.5">
                <UiIcon
                  name="shield-check"
                  :size="16"
                  class="text-brand-700"
                />
                {{ t('marketplace.providerProfile.identityChecked') }}
              </p>
              <p class="flex items-center gap-2.5">
                <UiIcon
                  name="calendar"
                  :size="16"
                  class="text-brand-700"
                />
                {{ t('marketplace.providerProfile.availability') }}
              </p>
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
            <div class="h-[150px]">
              <UiPlaceholderMedia
                icon="map-pin"
                tone="accent"
                label="300 x 150"
              />
            </div>
            <p class="p-4 text-sm text-black/60 dark:text-white/60">
              {{ t('marketplace.providerProfile.serviceArea', { radius: provider.serviceAreaKm }) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
