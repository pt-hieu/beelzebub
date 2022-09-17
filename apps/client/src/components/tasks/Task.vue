<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { reactive, watch, type Ref } from 'vue'

type Props = {
  taskData: Model.Todo
  weekDays: moment.Moment[]
  isSelected?: boolean
  isLoading?: boolean
}

const { taskData, isSelected, weekDays } = defineProps<Props>()

const computedPosition = reactive({ top: '0px', left: '0px', height: '0px' })
watch(
  () => taskData,
  ({ duration, startTime }) => {
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
    class="absolute text-white ring-1 ring-blue-tint hover:z-[999] bg-blue hover:bg-blue-tint duration-100 shadow-md shadow-blue-shade p-2 text-left rounded-lg overflow-hidden w-[calc((100vw-120px)/8-10px)] min-h-[70px]"

  >
    <div class="font-medium">
      {{ taskData.title }}
    </div>

    <div class="text-sm">
      {{ moment(taskData.startTime).format('HH mm A') }}
      <span v-if="!!taskData.duration">- {{ taskData.duration }} minutes</span>
    </div>
  </div>
</template>
