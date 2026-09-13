<script setup lang="ts">
// Auto-imported as <UiLocaleSwitcher />. Renders nothing while only one locale is
// active — add a locale to `nuxt.config.ts` -> i18n.locales and this activates with
// no other code changes.
const { locale, locales } = useI18n()

const otherLocales = computed(() =>
  locales.value.filter(entry => entry.code !== locale.value),
)
</script>

<template>
  <nav
    v-if="otherLocales.length"
    aria-label="Language"
    class="flex gap-3 text-sm"
  >
    <SwitchLocalePathLink
      v-for="entry in otherLocales"
      :key="entry.code"
      :locale="entry.code"
      class="hover:text-brand-600"
    >
      {{ entry.name }}
    </SwitchLocalePathLink>
  </nav>
</template>
