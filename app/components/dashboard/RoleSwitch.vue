<script setup lang="ts">
import type { UserRole } from '#shared/types/dashboard'

// Auto-imported as <DashboardRoleSwitch/>. Lives in the dashboard topbar
// (see `layouts/dashboard.vue`) — switches which widgets the overview
// emphasizes. It never gates a route: Browse Services and My Purchases stay
// reachable from the sidebar regardless of which role is active (see
// `DashboardDualRoleBanner` and CLAUDE.md's brief for this feature).
const session = useSession()
const { t } = useI18n()

function optionClass(role: UserRole) {
  return [
    'rounded-full px-4 py-2 text-xs font-bold transition-colors',
    session.activeRole.value === role
      ? 'bg-brand-600 text-white'
      : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white',
  ]
}
</script>

<template>
  <div class="inline-flex gap-1 rounded-full border border-black/10 bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.06]">
    <button
      type="button"
      :class="optionClass('provider')"
      @click="session.setActiveRole('provider')"
    >
      {{ t('dashboard.roleSwitch.provider') }}
    </button>
    <button
      type="button"
      :class="optionClass('consumer')"
      @click="session.setActiveRole('consumer')"
    >
      {{ t('dashboard.roleSwitch.consumer') }}
    </button>
  </div>
</template>
