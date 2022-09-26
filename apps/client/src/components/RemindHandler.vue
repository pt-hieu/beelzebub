<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { WebviewWindow } from '@tauri-apps/api/window'
import { watch } from 'vue'

import { useOnSseEvent } from '../composables/useOnSseEvent'

let todo = $ref<Model.Todo[]>([])

watch($$(todo), async (newTodo, oldTodo) => {
  if (newTodo.length <= oldTodo.length) return

  const [target] = newTodo.slice(-1)
  const webview = new WebviewWindow(target.id + Date.now(), {
    url: import.meta.env.VITE_LOCAL + `?remindId=${target.id}`,
  })

  const bc = new BroadcastChannel('beelzebub')

  await webview.once('tauri://error', (e) => {
    console.error(e)
  })

  await webview.once('tauri://created', () => {
    setTimeout(() => {
      bc.postMessage(JSON.stringify(target))
    }, 0)
  })

  await webview.once('tauri://destroyed', () => {
    bc.close()
  })
})

useOnSseEvent('todo.remind.1', (remindTodo) => {
  todo = [...todo, remindTodo]
})
</script>

<template></template>
