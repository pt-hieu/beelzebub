<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { useDispatchPiniaEvent } from '../../composables/useDispatchPiniaEvent.js'
import { useOnSseEvent } from '../../composables/useOnSseEvent.js'

let todo = $ref<Model.Todo>()

useOnSseEvent('todo.remind.1', (toRemindTodo) => {
  todo = toRemindTodo
})

const dispatch = useDispatchPiniaEvent()
</script>

<template>
  <template v-if="!!todo">
    <div class="min-h-[450px]">
      {{ JSON.stringify(todo) }}
    </div>

    <button @click="dispatch(undefined, 'close-sse')" class="button">
      close
    </button>
  </template>
</template>
