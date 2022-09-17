<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import FooterVue from '../components/Footer.vue'
import ModalVue from '../components/Modal.vue'
import CreateTaskVue from '../components/tasks/CreateTask.vue'
import { DELETE_TODO, GET_TODOES, type GetTodoesRes } from '../queries/todo'
import TaskVue from '../components/tasks/Task.vue'
import DropdownVue from '../components/Dropdown.vue'
import ConfirmVue from '../components/Confirm.vue'
import MotionVue from '../components/Motion.vue'
import { leaveByWidthVariant } from '../variants/leave-by-width'
import moment from 'moment'
import CurrentHourIndicator from '../components/tasks/CurrentHourIndicator.vue'

const { result } = useQuery<GetTodoesRes>(GET_TODOES)

const createTask = ref(false)
const createTaskRef = ref<InstanceType<typeof CreateTaskVue> | null>(null)
const selectedTasks = ref<Model.Todo[]>([])
const confirmRef = ref<InstanceType<typeof ConfirmVue> | null>(null)

const { mutate, onDone, loading } = useMutation(DELETE_TODO, {
  update: (cache, { data: { deleteTodo } }) => {
    let data = cache.readQuery<GetTodoesRes>({ query: GET_TODOES })
    data = {
      todoes: (data?.todoes || []).filter((todo) => todo.id !== deleteTodo.id),
    }

    cache.writeQuery({ query: GET_TODOES, data })
  },
})

onDone(() => {
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
  index: number,
) => {
  if (e.ctrlKey) {
    selectedTasks.value.push(task)
    return
  }

  if (e.altKey) {
    selectedTasks.value = result.value?.todoes.slice(0, index + 1) || []
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
      document.querySelectorAll(`button[data-vue-type='task-component']`),
    )
  },
  { flush: 'post', immediate: true },
)

const handleClickOutsideTask = (e: Event) => {
  const target = e.target as HTMLElement
  if (taskComponents.value.some((comp) => comp.contains(target))) return

  selectedTasks.value = []
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideTask)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideTask)
})

const today = $ref(moment())
const weekDays = $computed(() => {
  const weekStart = today.clone().startOf('week')
  const days: ReturnType<typeof moment>[] = []

  let i = 0
  while (i < 7) {
    days.push(weekStart.clone().add(i, 'days'))
    i++
  }

  return days
})
</script>

<template>
  <div class="mt-8 grid grid-cols-8 divide-x divide-blue/30">
    <div />
    <div
      v-for="(day, index) in weekDays"
      :key="index"
      class="text-center py-2"
      data-vue-type="week-day"
    >
      <div class="uppercase">{{ day.format('ddd') }}</div>
      <div class="text-xl text-blue">{{ day.format('DD') }}</div>
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
        class="h-[70px] text-center grid place-content-center"
      >
        <span>{{ index.toString().padStart(2, '0') }}:00</span>
      </div>
    </div>

    <div class="col-span-7 relative">
      <task-vue
        v-for="(todo, index) in result?.todoes"
        :key="todo.id"
        :task-data="todo"
        :is-loading="loading"
        :week-days="weekDays"
        :is-selected="
          selectedTasks.some((selectedTask) => selectedTask.id === todo.id)
        "
        @click="handleTaskClick($event, todo, index)"
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
    <create-task-vue @done="createTask = false" ref="createTaskRef" />
  </modal-vue>

  <footer-vue>
    <confirm-vue
      ref="confirmRef"
      :message="`Are you sure you want to delete ${selectedTasks.length} tasks?`"
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

    <dropdown-vue :hold="true">
      <button class="button-2nd"><span class="fa fa-eye mr-2" />View</button>

      <template #overlay>
        <div class="border border-blue rounded-md bg-[#fff] shadow-sm p-4">
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
