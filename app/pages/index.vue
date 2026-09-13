<script setup lang="ts">
interface HealthResponse {
  status: string
  timestamp: number
}

const { t } = useI18n()

// Critical, SEO-relevant data: fetch with `await` so it's in the server-rendered HTML.
const { data: health } = await useApi<HealthResponse>('/health')

// SEO/OG copy comes from i18n messages so every locale gets correctly localized
// meta — never hardcode this text, even for a single active locale.
useSeoMeta({
  title: t('home.seoTitle'),
  description: t('home.seoDescription'),
})
defineOgImage('DefaultSatori', {
  title: 'FindPeople',
  description: t('home.seoDescription'),
})
useSchemaOrg([defineWebPage()])
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-16">
    <h1 class="text-4xl font-bold tracking-tight text-brand-700 dark:text-brand-500">
      FindPeople
    </h1>
    <!-- Rich interpolation: use <i18n-t> (not a flat $t string) when a translated
         message needs to carry markup — here, <code> spans around literal API/token
         names. This is the pattern for any future copy that mixes translated text
         with inline formatting. -->
    <i18n-t
      keypath="home.bodyIntro"
      tag="p"
      class="max-w-prose text-black/70 dark:text-white/70"
    >
      <template #useApi>
        <code>useApi</code>
      </template>
      <template #uiButton>
        <code>UiButton</code>
      </template>
      <template #theme>
        <code>@theme</code>
      </template>
    </i18n-t>
    <UiButton>{{ t('home.cta') }}</UiButton>
    <p
      v-if="health"
      class="text-xs text-black/40 dark:text-white/40"
    >
      {{ t('home.apiStatus', { status: health.status }) }}
    </p>
  </section>
</template>
