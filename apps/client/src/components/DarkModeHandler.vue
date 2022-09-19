<script lang="ts" setup>
import { onMounted } from 'vue'
import { canRestoreDarkMode, enableDarkMode } from '../libs/darkmode.js'

onMounted(async () => {
  if (await canRestoreDarkMode()) {
    enableDarkMode()
  }
})
</script>

<template></template>
