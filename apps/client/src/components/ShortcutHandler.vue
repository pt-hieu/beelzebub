<script lang="ts" setup>
import { registerAll, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { onMounted, onUnmounted } from 'vue'
import { useDispatchPiniaEvent } from '../composables/useDispatchPiniaEvent.js'
import { isWeb } from '../libs/platform.js'
import { useToast } from '../pinia/toast.js'
import { shortcuts } from '../shortcuts.js'

const dispatch = useDispatchPiniaEvent()
const toast = useToast()

onMounted(async () => {
  if (isWeb()) return

  await registerAll(
    shortcuts
      .filter((shortcut) => shortcut.scope === 'global')
      .map((shortcut) => shortcut.keys),
    async (s) => {
      dispatch({}, s)
    },
  )

  toast.add('Complete registering global shortcuts', 'Info', undefined, 2)
})

onUnmounted(async () => {
  if (isWeb()) return
  await unregisterAll()
})
</script>

<template></template>
