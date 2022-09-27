<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { useOnSseEvent } from '../../composables/useOnSseEvent.js'

let todo = $ref<Model.Todo>()

useOnSseEvent('todo.remind.1', (toRemindTodo) => {
  todo = toRemindTodo
})
</script>

<template>
  <template v-if="!!todo">
    {{ JSON.stringify(todo) }}
  </template>
</template>
