<script lang="ts" setup>
import { WebviewWindow } from '@tauri-apps/api/window'
import { markRaw } from 'vue'

import { useOnSseEvent } from '../composables/useOnSseEvent'

const webviewDict = markRaw(new Map<string, WebviewWindow>())

useOnSseEvent('todo.trigger-remind.1', (todoId) => {
  const webview = new WebviewWindow(todoId + Date.now(), {
    url: import.meta.env.VITE_LOCAL + `?remindId=${todoId}`,
    title: 'Reminder',
    alwaysOnTop: true,
    decorations: false,
    focus: true,
    transparent: true,
    resizable: false,
    width: 600,
    height: 450,
    center: true,
  })

  webview.once('tauri://error', (e) => {
    console.log(e)
  })

  webview.once('tauri://created', () => {
    webviewDict.set(todoId, webview)
  })
})

useOnSseEvent('todo.close-reminder.1', async (todoId) => {
  const webview = webviewDict.get(todoId)
  if (!webview) return

  await webview.close()
  webviewDict.delete(todoId)
})
</script>

<template></template>
