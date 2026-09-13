<script setup lang="ts">
useSeoMeta({
  titleTemplate: title => (title ? `${title} · FindPeople` : 'FindPeople'),
})

// Global i18n SEO wiring: html[lang]/[dir], canonical, hreflang alternates
// (incl. x-default) and og:locale for every route, in every locale — do this
// once here, not per-page. With one locale active there are no alternates to
// emit yet, but this is exactly what makes adding a second locale a config
// change instead of a per-page rework.
const i18nHead = useLocaleHead({ seo: true })
useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}))
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
