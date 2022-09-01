<script lang="ts" setup>
import { registerAll, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { onMounted, onUnmounted } from 'vue'
import { useDispatchPiniaEvent } from '../composables/useDispatchPiniaEvent.js'
import { isWeb } from '../libs/platform.js'
import { useToast } from '../pinia/toast.js'

const shortcuts = ['Control+Alt+Q']

const dispatch = useDispatchPiniaEvent()
const toast = useToast()

onMounted(async () => {
  if (isWeb()) return

  await registerAll(shortcuts, async (s) => {
    dispatch({}, s)
  })

  toast.add('Complete registering shortcuts', 'Info', undefined, 2)
})

onUnmounted(async () => {
  if (isWeb()) return
  await unregisterAll()
})
</script>

<template></template>
