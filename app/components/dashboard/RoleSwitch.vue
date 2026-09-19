<script setup lang="ts">
import type { UserRole } from '#shared/types/dashboard'

// Auto-imported as <DashboardRoleSwitch/>. Lives in the dashboard topbar
// (see `layouts/dashboard.vue`) — switches which panel you're in. Provider-
// only nav (My profile/Verification, My Services, Clients Served) and
// consumer-only nav (My Purchases, Saved Providers) show/hide based on this;
// Browse Services stays reachable in both modes (see `DashboardDualRoleBanner`).
// Shown Consumer-first since most people who sign up are consumers.
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
      :class="optionClass('consumer')"
      @click="session.setActiveRole('consumer')"
    >
      {{ t('dashboard.roleSwitch.consumer') }}
    </button>
    <button
      type="button"
      :class="optionClass('provider')"
      @click="session.setActiveRole('provider')"
    >
      {{ t('dashboard.roleSwitch.provider') }}
    </button>
  </div>
</template>
