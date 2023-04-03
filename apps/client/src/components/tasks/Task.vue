<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { markRaw, onMounted, onUnmounted, reactive, watch } from 'vue'

import Tooltip from '../Tooltip.vue'
import Confirm from '../Confirm.vue'

import { pluralize } from '../../libs/text'
import { useWindowResize } from '../../composables/useWindowResize'
import { useUpdateTask } from '../../mutations/update-todo'

type Props = {
  taskData: Model.Todo
  weekDays: moment.Moment[]
  isSelected?: boolean
  isLoading?: boolean
}

const { taskData, isSelected, weekDays } = defineProps<Props>()
const wdResize = $(useWindowResize())

const taskEle = $ref<HTMLDivElement>()
const resizer = $ref<HTMLDivElement>()

const computedPosition = reactive({ top: '0px', left: '0px', height: '0px' })

const weekDayElements = markRaw<HTMLDivElement[]>(
  Array.from(
    document.querySelectorAll(`div[data-vue-type='week-day']`),
  ) as HTMLDivElement[],
)

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

    weekDays.forEach((day, index) => {
      const clonedDay = day.clone()

      const isWeekly = taskData.weekly
      const isSameDate = clonedDay.isSame(momentStarttime, 'date')
      const isSameWeekday =
        clonedDay.format('ddd') === momentStarttime.format('ddd')

      if (!isSameDate && !isWeekly) return
      if (!isSameWeekday && isWeekly) return

      computedPosition.left =
        weekDayElements[0].getBoundingClientRect().width * index + 'px'
    })
  },
  { immediate: true },
)

let startY = $ref(0)
let offsetY = $ref(0)
let isMouseDown = $ref(false)

watch($$(isMouseDown), (isMouseDown) => {
  if (isMouseDown) {
    document.body.style.cursor = 'n-resize'
    return
  }

  document.body.style.cursor = 'unset'
})

let duration = $ref(taskData.duration || 0)
const confirmRef = $ref<InstanceType<typeof Confirm>>()

function abortDurationUpdate() {
  duration = taskData.duration || 0
  computedPosition.height = ((duration || 10) / 60) * 70 + 'px'
}

watch(
  () => taskData,
  (taskData) => {
    duration = taskData.duration || 0
  },
)

watch(
  () => computedPosition.height,
  (value) => {
    const height = Number(value.split('px')[0])
    if (Number.isNaN(height)) return

    const minutes = Math.floor((height / 70) * 60)
    duration = minutes
  },
)

function resizerMouseDown(e: MouseEvent) {
  const target = e.target as HTMLDivElement
  if (!target.isSameNode(resizer)) return

  isMouseDown = true

  startY = e.y
  window.addEventListener('mousemove', resizerMouseMove)
}

function resizerMouseUp() {
  if (!isMouseDown) return
  isMouseDown = false

  window.removeEventListener('mousemove', resizerMouseMove)
  if (duration === taskData.duration) return

  confirmRef.open()
}

function resizerMouseMove(e: MouseEvent) {
  if (!isMouseDown) return

  offsetY = e.y - startY
  startY = e.y

  if (offsetY === 0) return

  let [height] = computedPosition.height.split('px')
  height = Math.max(Number(height) + offsetY, 80) + 'px'

  computedPosition.height = height
}

onMounted(() => {
  window.addEventListener('mousedown', resizerMouseDown)
  window.addEventListener('mouseup', resizerMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', resizerMouseDown)
  window.removeEventListener('mouseup', resizerMouseUp)

  try {
    window.removeEventListener('mousemove', resizerMouseMove)
  } catch (e) {}
})

const { update, updating } = useUpdateTask()
let updatingAllInstance = $ref(false)
let updatingTargetOnly = $ref(false)

function updateAllTaskInstance() {
  updatingAllInstance = true

  update({
    id: taskData.id,
    input: { duration },
    options: { updateOnlyTarget: false },
  })
}

function updateTargetTaskOnly() {
  updatingTargetOnly = true

  update({
    id: taskData.id,
    input: { duration },
    options: { updateOnlyTarget: true },
  })
}

watch(updating, (updating) => {
  if (!updating) {
    updatingAllInstance = false
    updatingTargetOnly = false
  }
})
</script>

<template>
  <div
    data-vue-type="task-component"
    ref="taskEle"
    role="button"
    :style="computedPosition"
    :class="[
      'absolute text-white p-2 text-left rounded-lg w-[calc((100vw-120px)/8-4px)] min-h-[80px] group',
      'hover:ring-1 ring-blue ring-offset-1 hover:shadow-lg shadow-blue duration-100',
      !!taskData.duration && 'bg-gradient-to-br from-blue to-blue-shade',
      !taskData.duration && 'bg-transparent bg-blue',
      'dark:from-$blue dark:to-$blue-shade dark:ring-1 dark:ring-cyan dark:shadow-cyan/30',
    ]"
  >
    <div
      ref="resizer"
      :class="[
        'absolute left-2 w-[calc(100%-16px)] h-[3px] bg-white rounded-full',
        'cursor-n-resize group-hover:bottom-1 -bottom-3 duration-100',
        isMouseDown && 'bottom-1',
      ]"
    />

    <confirm
      ref="confirmRef"
      :is-loading="updatingTargetOnly"
      :ok-text="taskData.weekly ? 'Update this task only' : 'Update'"
      :nd-buttons="
        taskData.weekly
          ? [
              {
                text: 'Update all tasks',
                onClick: updateAllTaskInstance,
                icon: 'fa fa-globe-asia',
                loading: updatingAllInstance,
              },
            ]
          : []
      "
      :message="`Are you sure you want to update duration from ${pluralize(
        taskData.duration || 0,
        'minute',
      )} to ${pluralize(duration, 'minute')}`"
      @ok="updateTargetTaskOnly"
      @cancel="abortDurationUpdate"
    />

    <div class="font-medium truncate">
      {{ taskData.title }}
    </div>

    <div class="text-sm">
      {{ moment(taskData.startTime).format('HH mm A') }}
      <span v-if="!!taskData.duration">- {{ duration }} minutes</span>

      <tooltip
        v-if="taskData.weekly"
        text="This task is weekly"
        as="span"
        movable
      >
        <span class="fa fa-retweet ml-2" />
      </tooltip>
    </div>

    <span
      class="fa fa-check-circle absolute bottom-2 right-4"
      v-if="isSelected"
      v-motion-fade
    />
  </div>
</template>
