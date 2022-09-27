<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { WebviewWindow } from '@tauri-apps/api/window'
import { watch } from 'vue'

import { useOnSseEvent } from '../composables/useOnSseEvent'

let todoIds = $ref<Model.Todo['id'][]>([])

watch($$(todoIds), async (newTodo, oldTodo) => {
  if (newTodo.length <= oldTodo.length) return

  const [targetId] = newTodo.slice(-1)
  const webview = new WebviewWindow(targetId + Date.now(), {
    url: import.meta.env.VITE_LOCAL + `?remindId=${targetId}`,
  })

  webview.once('tauri://error', (e) => {
    console.log(e)
  })
})

useOnSseEvent('todo.trigger-remind.1', (todoId) => {
  todoIds = [...todoIds, todoId]
})
</script>

<template></template>
