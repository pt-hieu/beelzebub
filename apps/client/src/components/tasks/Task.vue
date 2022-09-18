<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { reactive, watch } from 'vue'
import { useWindowResize } from '../../composables/useWindowResize.js'

type Props = {
  taskData: Model.Todo
  weekDays: moment.Moment[]
  isSelected?: boolean
  isLoading?: boolean
}

const { taskData, isSelected, weekDays } = defineProps<Props>()
const wdResize = $(useWindowResize())

const computedPosition = reactive({ top: '0px', left: '0px', height: '0px' })
watch(
  () => [taskData, wdResize] as const,
  ([{ duration, startTime }]) => {
    const momentStarttime = moment(startTime)

    computedPosition.height = ((duration || 10) / 60) * 70 + 'px'
    computedPosition.top =
      (momentStarttime.diff(momentStarttime.clone().startOf('day'), 'minute') /
        60) *
        70 +
      'px'

    const weekDayElements = Array.from(
      document.querySelectorAll(`div[data-vue-type='week-day']`),
    ) as HTMLDivElement[]

    weekDays.forEach((day, index) => {
      if (!day.clone().isSame(momentStarttime, 'day')) return
      computedPosition.left =
        weekDayElements[0]?.getBoundingClientRect().width * index + 'px'
    })
  },
  { immediate: true },
)
</script>

<template>
  <div
    data-vue-type="task-component"
    role="button"
    :style="computedPosition"
    :class="[
      'absolute text-white p-2 text-left rounded-lg overflow-hidden w-[calc((100vw-120px)/8-10px)] min-h-[80px]',
      'hover:ring-1 ring-blue ring-offset-1 hover:shadow-lg shadow-blue duration-100',
      !!taskData.duration && 'bg-gradient-to-br from-blue to-blue-shade',
      !taskData.duration && 'bg-transparent bg-blue',
    ]"
  >
    <div class="font-medium truncate">
      {{ taskData.title }}
    </div>

    <div class="text-sm">
      {{ moment(taskData.startTime).format('HH mm A') }}
      <span v-if="!!taskData.duration">- {{ taskData.duration }} minutes</span>
      <span v-if="taskData.weekly" class="fa fa-retweet ml-2" />
    </div>

    <span
      class="fa fa-check-circle absolute bottom-2 right-4"
      v-if="isSelected"
      v-motion-fade
    />
  </div>
</template>
