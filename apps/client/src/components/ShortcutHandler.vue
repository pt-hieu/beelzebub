<script lang="ts" setup>
import {
  registerAll,
  unregisterAll,
  isRegistered,
} from '@tauri-apps/api/globalShortcut'
import { onMounted, onUnmounted } from 'vue'
import { useDispatchPiniaEvent } from '../composables/useDispatchPiniaEvent.js'
import { isWeb } from '../libs/platform.js'
import { useToast } from '../pinia/toast.js'
import { shortcuts } from '../shortcuts.js'

const dispatch = useDispatchPiniaEvent()
const toast = useToast()

onMounted(async () => {
  if (isWeb()) return

  const globalShortcuts = shortcuts
    .filter((shortcut) => shortcut.scope === 'global')
    .map((shortcut) => shortcut.keys)

  const unregisteredGlobalShortcuts = await Promise.all(
    globalShortcuts.map(async (short) => {
      const registered = await isRegistered(short)
      return registered ? '' : short
    }),
  )

  await registerAll(
    unregisteredGlobalShortcuts.filter((s) => !!s),
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
