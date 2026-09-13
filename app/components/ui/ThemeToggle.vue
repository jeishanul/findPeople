<script setup lang="ts">
// Auto-imported as <UiThemeToggle />. Defaults to the OS preference
// (`@nuxtjs/color-mode`'s `preference: 'system'`); clicking pins an explicit
// choice to localStorage, applied via a blocking inline script the module
// injects before hydration, so there's no flash of the wrong theme on
// refresh. Where supported, the switch itself flips
// instantly while the *page* cross-fades via a circular View Transition
// expanding from the click point — a no-op, fully-functional toggle on
// browsers without the API (prefers-reduced-motion also skips it).
const colorMode = useColorMode()
const { t } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')
const label = computed(() => isDark.value ? t('theme.switchToLight') : t('theme.switchToDark'))

function toggle(event: MouseEvent) {
  const next = isDark.value ? 'light' : 'dark'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || prefersReducedMotion) {
    colorMode.preference = next
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  const transition = document.startViewTransition(() => {
    colorMode.preference = next
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 550,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <button
    type="button"
    class="group relative inline-flex h-8 w-[60px] shrink-0 items-center rounded-full border transition-colors duration-500"
    :class="isDark
      ? 'border-white/10 bg-brand-700'
      : 'border-black/10 bg-slate-100'"
    role="switch"
    :aria-checked="isDark"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <span
      class="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <span
        class="absolute left-[10px] top-2 h-[3px] w-[3px] rounded-full bg-white transition-opacity duration-500"
        :class="isDark ? 'opacity-70' : 'opacity-0'"
      />
      <span
        class="absolute left-[18px] top-4 h-[2px] w-[2px] rounded-full bg-white transition-opacity duration-700"
        :class="isDark ? 'opacity-50' : 'opacity-0'"
      />
    </span>

    <span
      class="relative flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
      :class="isDark ? 'translate-x-[29px]' : 'translate-x-0.5'"
    >
      <UiIcon
        v-if="isDark"
        name="moon"
        filled
        :size="14"
        class="text-brand-700"
      />
      <UiIcon
        v-else
        name="sun"
        :size="14"
        class="text-accent-600"
      />
    </span>
  </button>
</template>
