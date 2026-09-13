<script setup lang="ts">
// Auto-imported as <UiQrCode />. A decorative QR-code-look placeholder — not a
// real, scannable code — used anywhere the design calls for an app-download QR.
withDefaults(
  defineProps<{
    size?: number
  }>(),
  { size: 64 },
)
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-brand-700 dark:border-white/10"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <UiIcon
      name="qr"
      filled
      :size="Math.round(size * 0.68)"
    />
  </div>
</template>
