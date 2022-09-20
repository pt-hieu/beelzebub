<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { debounce } from 'lodash'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

import FooterVue from '../components/Footer.vue'
import ModalVue from '../components/Modal.vue'
import CreateTaskVue from '../components/tasks/CreateTask.vue'
import { DELETE_TODO, GET_TODOES, type GetTodoesRes } from '../queries/todo'
import TaskVue from '../components/tasks/Task.vue'
import DropdownVue from '../components/Dropdown.vue'
import ConfirmVue from '../components/Confirm.vue'
import Tooltip from '../components/Tooltip.vue'
import MotionVue from '../components/Motion.vue'
import { leaveByWidthVariant } from '../variants/leave-by-width'
import moment from 'moment'
import CurrentHourIndicator from '../components/tasks/CurrentHourIndicator.vue'
import { pluralize } from '../libs/text'

const createTask = ref(false)
const createTaskRef = ref<InstanceType<typeof CreateTaskVue> | null>(null)
const selectedTasks = ref<Model.Todo[]>([])
const confirmRef = ref<InstanceType<typeof ConfirmVue> | null>(null)

let today = $ref(moment())
let weekDays = $ref<moment.Moment[]>([])

watch(
  $$(today),
  (today) => {
    const weekStart = today.clone().startOf('week')
    const days: ReturnType<typeof moment>[] = []

    let i = 0
    while (i < 7) {
      days.push(weekStart.clone().add(i, 'days'))
      i++
    }

    weekDays = days
  },
  { immediate: true },
)

const getTodoesVars = reactive<{ dto: { from?: Date; to?: Date } }>({
  dto: {
    from: weekDays[0].toDate(),
    to: weekDays.slice(-1)[0].clone().endOf('day').toDate(),
  },
})

const { result, refetch } = useQuery<GetTodoesRes>(GET_TODOES, getTodoesVars)

const loadTasks = debounce((weekDays: moment.Moment[]) => {
  if (weekDays.length !== 7) return

  getTodoesVars.dto = {
    from: weekDays[0].toDate(),
    to: weekDays.slice(-1)[0].clone().endOf('day').toDate(),
  }
}, 400)

watch($$(weekDays), (weekDays) => {
  loadTasks(weekDays)
})

const { mutate, onDone, loading } = useMutation(DELETE_TODO)

onDone(() => {
  refetch()
  selectedTasks.value = []
})

const deleteTasks = () => {
  confirmRef.value?.close()
  mutate({ id: selectedTasks.value[0].id })
}

const filter = ref<string[]>([])

watch(createTask, () => {
  if (!createTask.value) return
  createTaskRef.value?.reset()
})

const handleTaskClick = (
  e: Event & { ctrlKey: boolean; altKey: boolean },
  task: Model.Todo,
) => {
  if (e.ctrlKey) {
    selectedTasks.value.push(task)
    return
  }

  selectedTasks.value = [task]
}

const taskComponents = ref<Element[]>([])
watch(
  result,
  (newResult, oldResult) => {
    if (newResult?.todoes.length === oldResult?.todoes.length) return
    taskComponents.value = Array.from(
      document.querySelectorAll(`div[data-vue-type='task-component']`),
    )
  },
  { flush: 'post', immediate: true },
)

const handleClickOutsideTask = (e: Event) => {
  const target = e.target as HTMLElement
  if (taskComponents.value.some((comp) => comp.contains(target))) return

  selectedTasks.value = []
}

const moveForward = () => {
  today = today.clone().add(7, 'days')
}

const moveBackward = () => {
  today = today.clone().subtract(7, 'days')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideTask)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideTask)
})
</script>

<template>
  <div
    class="mt-8 grid grid-cols-8 divide-x divide-blue/30 border-b border-blue/30 dark:border-cyan/30 dark:divide-cyan/30"
  >
    <div class="flex items-center justify-center gap-4">
      <tooltip text="Move backward one week" as="button" @click="moveBackward">
        <span class="fa fa-angle-left dark:text-white" />
      </tooltip>

      <div class="text-center font-medium">
        <div class="uppercase text-blue text-lg dark:text-cyan-shade">
          {{ today.format('MMM / YYYY') }}
        </div>
        <div class="dark:text-white/80">{{ today.week() }}</div>
      </div>

      <tooltip text="Move forward one week" as="button" @click="moveForward">
        <span class="fa fa-angle-right dark:text-white" />
      </tooltip>
    </div>

    <div
      v-for="(day, index) in weekDays"
      :key="index"
      class="text-center py-2"
      data-vue-type="week-day"
    >
      <div class="uppercase dark:text-white/80">{{ day.format('ddd') }}</div>
      <div class="text-xl text-blue dark:text-cyan-shade">
        {{ day.format('DD') }}
      </div>
    </div>
  </div>

  <div
    class="py-8 grid grid-cols-8 max-h-[calc(100vh-240px)] overflow-y-auto relative"
  >
    <current-hour-indicator />

    <div>
      <div
        v-for="(_, index) in Array(24).fill('')"
        :key="index"
        class="h-[70px] text-center grid place-content-center dark:text-white/80"
      >
        <span>{{ index.toString().padStart(2, '0') }}:00</span>
      </div>
    </div>

    <div class="col-span-7 relative">
      <task-vue
        v-for="todo in result?.todoes"
        :key="todo.id"
        :task-data="todo"
        :is-loading="loading"
        :week-days="weekDays"
        :is-selected="
          selectedTasks.some((selectedTask) => selectedTask.id === todo.id)
        "
        @click="handleTaskClick($event, todo)"
      />
    </div>
  </div>

  <modal-vue
    :visible="createTask"
    @close="createTask = false"
    @ok="createTaskRef?.submit()"
    title="Create Task"
    class="min-w-[450px]"
  >
    <create-task-vue
      @done="
        () => {
          createTask = false
          refetch()
        }
      "
      ref="createTaskRef"
    />
  </modal-vue>

  <footer-vue>
    <confirm-vue
      ref="confirmRef"
      :message="`Are you sure you want to delete ${pluralize(
        selectedTasks.length,
        'task',
      )}?`"
      @ok="deleteTasks"
    >
      <motion-vue
        :flag="!!selectedTasks.length"
        :variants="leaveByWidthVariant"
      >
        <button
          :class="`button-2nd danger-2nd ${
            selectedTasks.length ? '' : 'pointer-events-none'
          }`"
        >
          <span class="fa fa-trash mr-2" />Delete{{
            selectedTasks.length > 1 ? ` ${selectedTasks.length}` : ''
          }}
        </button>
      </motion-vue>
    </confirm-vue>

    <dropdown-vue as="button" :hold="true" class="button-2nd">
      <span class="fa fa-eye mr-2" />View

      <template #overlay>
        <div
          class="border border-blue dark:border-cyan/60 rounded-md bg-white dark:bg-$blue shadow-sm p-4"
        >
          <form-kit
            type="checkbox"
            v-model="filter"
            :options="['URGENT', 'IMPORTANT', '!URGENT', '!IMPORTANT']"
          />
        </div>
      </template>
    </dropdown-vue>

    <button @click="createTask = true" class="button-2nd">
      <span class="fa fa-plus mr-2" />Add Task
    </button>
  </footer-vue>
</template>
