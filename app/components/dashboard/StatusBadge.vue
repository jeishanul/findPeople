<script setup lang="ts">
import type { BookingStatus } from '#shared/types/dashboard'

// Auto-imported as <DashboardStatusBadge/>. Shared status pill for the
// clients-served and purchases tables (and their dashboard previews) so the
// color/label mapping for a `BookingStatus` lives in exactly one place.
const props = defineProps<{
  status: BookingStatus
}>()

const { t } = useI18n()

const VARIANT_BY_STATUS: Record<BookingStatus, 'primary' | 'neutral' | 'accent' | 'danger'> = {
  completed: 'primary',
  upcoming: 'neutral',
  in_progress: 'accent',
  cancelled: 'danger',
}
</script>

<template>
  <UiTag :variant="VARIANT_BY_STATUS[props.status]">
    {{ t(`dashboard.status.${props.status}`) }}
  </UiTag>
</template>
