<script lang="ts" setup>
import type { Model } from '@black/share'
import moment from 'moment'

type Props = {
  taskData: Model.Todo
  isSelected?: boolean
  isLoading?: boolean
}

const { taskData, isSelected } = defineProps<Props>()
</script>

<template>
  <button
    data-vue-type="task-component"
    class="rounded-lg p-4 border border-blue overflow-hidden h-fit"
  >
    <div class="capitalize -m-6 mb-0 p-6 pt-4 text-left">
      <div v-if="!!taskData.deadline" class="border-b border-black/20 pb-1">
        {{ moment(taskData.deadline).fromNow() }}
      </div>

      <div class="mt-2">
        {{ taskData.content }}
      </div>
    </div>

    <div
      :class="`${
        isSelected ? 'bg-blue-shade' : 'bg-blue'
      } -m-4 px-4 py-3 text-white grid grid-cols-[70px,1fr] items-center gap-2 duration-100`"
    >
      <div class="truncate text-left">{{ taskData.title }}</div>

      <div class="flex justify-end gap-2">
        <div
          v-for="cate in taskData.categorization"
          :key="cate"
          class="py-1 px-2 border rounded-md border-white w-fit"
        >
          {{ cate }}
        </div>
      </div>
    </div>
  </button>
</template>
