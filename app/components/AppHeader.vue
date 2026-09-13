<script setup lang="ts">
// Nav labels come from i18n messages, not hardcoded strings — every future nav
// entry follows this pattern. `to` stays an unlocalized path; NuxtLinkLocale adds
// the active locale's prefix.
const { t } = useI18n()

const links = computed(() => [
  { label: t('nav.home'), to: '/' },
])
</script>

<template>
  <header class="border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <NuxtLinkLocale
        to="/"
        class="font-semibold text-brand-700 dark:text-brand-500"
      >
        FindPeople
      </NuxtLinkLocale>
      <div class="flex items-center gap-4">
        <ul class="flex gap-4 text-sm">
          <li
            v-for="link in links"
            :key="link.to"
          >
            <NuxtLinkLocale
              :to="link.to"
              class="hover:text-brand-600"
            >
              {{ link.label }}
            </NuxtLinkLocale>
          </li>
        </ul>
        <UiLocaleSwitcher />
      </div>
    </nav>
  </header>
</template>
