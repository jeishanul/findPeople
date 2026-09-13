<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()

const CUSTOMER_LINKS = [
  { label: t('footer.customers.browseServices'), to: '/browse' },
  { label: t('footer.customers.howItWorks'), to: '/#how-it-works' },
]

const POPULAR_CATEGORY_IDS = ['cleaning', 'electrician', 'plumber', 'ac-service']

const SOCIAL_LINKS: Array<{ label: string, icon: IconName, filled?: boolean, href: string }> = [
  { label: t('footer.social.facebook'), icon: 'facebook', filled: true, href: '#' },
  { label: t('footer.social.x'), icon: 'x', href: '#' },
  { label: t('footer.social.instagram'), icon: 'instagram', href: '#' },
]
</script>

<template>
  <footer class="bg-brand-700 py-14 text-white/90 dark:bg-black">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-10">
      <div class="sm:col-span-2 lg:col-span-1">
        <div class="flex items-center gap-2.5 font-display text-lg font-bold text-white">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <UiIcon
              name="leaf"
              :size="18"
            />
          </span>
          {{ t('brand.name') }}
        </div>
        <p class="mt-4 max-w-xs text-sm text-white/70">
          {{ t('footer.tagline') }}
        </p>
        <div class="mt-5 flex gap-2.5">
          <a
            v-for="social in SOCIAL_LINKS"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <UiIcon
              :name="social.icon"
              :filled="social.filled"
              :size="16"
            />
          </a>
        </div>
      </div>

      <div>
        <p class="mb-4 text-xs font-bold uppercase tracking-wide text-white/50">
          {{ t('footer.customers.heading') }}
        </p>
        <ul class="flex flex-col gap-2.5 text-sm">
          <li
            v-for="link in CUSTOMER_LINKS"
            :key="link.to"
          >
            <NuxtLinkLocale
              :to="link.to"
              class="text-white/80 hover:text-white"
            >
              {{ link.label }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-4 text-xs font-bold uppercase tracking-wide text-white/50">
          {{ t('footer.categories.heading') }}
        </p>
        <ul class="flex flex-col gap-2.5 text-sm">
          <li
            v-for="categoryId in POPULAR_CATEGORY_IDS"
            :key="categoryId"
          >
            <NuxtLinkLocale
              :to="{ path: '/browse', query: { category: categoryId } }"
              class="text-white/80 hover:text-white"
            >
              {{ t(`marketplace.categories.${categoryId}.label`) }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-4 text-xs font-bold uppercase tracking-wide text-white/50">
          {{ t('footer.contact.heading') }}
        </p>
        <ul class="flex flex-col gap-2.5 text-sm">
          <li>
            <a
              :href="`tel:${SUPPORT_PHONE}`"
              class="inline-flex items-center gap-2 text-white/80 hover:text-white"
            >
              <UiIcon
                name="phone"
                :size="14"
              />
              {{ SUPPORT_PHONE }}
            </a>
          </li>
          <li>
            <a
              :href="`mailto:${SUPPORT_EMAIL}`"
              class="inline-flex items-start gap-2 text-white/80 hover:text-white"
            >
              <UiIcon
                name="mail"
                :size="14"
                class="mt-0.5 shrink-0"
              />
              <span class="text-xs leading-relaxed break-all">{{ SUPPORT_EMAIL }}</span>
            </a>
          </li>
        </ul>
        <p class="mt-3 text-xs text-white/50">
          {{ t('footer.contact.hours') }}
        </p>
      </div>

      <div>
        <p class="mb-4 text-xs font-bold uppercase tracking-wide text-white/50">
          {{ t('footer.getTheApp') }}
        </p>
        <!-- Badges stacked on the left, QR code to the right, as a block. -->
        <div class="flex items-start gap-4">
          <MarketplaceAppStoreBadges tone="dark" />
          <UiQrCode :size="72" />
        </div>
      </div>
    </div>

    <div class="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/15 px-4 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
      <span>{{ t('footer.copyright', { year }) }}</span>
      <span>{{ t('footer.tagline2') }}</span>
    </div>
  </footer>
</template>
