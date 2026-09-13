<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-black/10 py-6 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
    &copy; {{ year }} FindPeople
  </footer>
</template>
