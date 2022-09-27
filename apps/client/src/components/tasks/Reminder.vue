<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { useDispatchPiniaEvent } from '../../composables/useDispatchPiniaEvent.js'
import { useOnSseEvent } from '../../composables/useOnSseEvent.js'

let todo = $ref<Model.Todo>()

useOnSseEvent('todo.remind.1', (toRemindTodo) => {
  todo = toRemindTodo
})

const dispatch = useDispatchPiniaEvent()
const closeReminder = () => {
  dispatch(undefined, 'close-sse')
}
</script>

<template>
  <template v-if="!!todo">
    <div class="h-[200px] p-4 grid grid-rows-[1fr,46px]">
      <main>
        <div
          data-tauri-drag-region
          class="text-blue font-medium text-xl cursor-grab"
        >
          {{ todo.title || 'Reminder' }}
        </div>

        <div class="capitalize text-sm">
          <span class="fa fa-clock mr-1 text-blue" />
          {{ moment().from(todo.startTime) }}
        </div>
      </main>

      <footer class="flex justify-end gap-2 items-center font-medium">
        <button class="button" @click="closeReminder">
          <span class="fa fa-check mr-2" />Close
        </button>
      </footer>
    </div>
  </template>
</template>
