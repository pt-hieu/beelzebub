<script lang="ts" setup>
import { useMutation, useQuery } from '@vue/apollo-composable'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import FooterVue from '../components/Footer.vue'
import ModalVue from '../components/Modal.vue'
import CreateTaskVue from '../components/CreateTask.vue'
import { DELETE_TODO, GET_TODOES, type GetTodoesRes } from '../queries/todo'
import TaskVue from '../components/Task.vue'
import DropdownVue from '../components/Dropdown.vue'
import type { Model } from '@black/share'
import ConfirmVue from '../components/Confirm.vue'
import MotionVue from '../components/Motion.vue'
import { leaveByWidthVariant } from '../variants/leave-by-width'

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
  () => {
    taskComponents.value = Array.from(
      document.querySelectorAll(`button[data-vue-type='task-component']`),
    )
  },
  { flush: 'post', immediate: true },
)

const handleClickOutsideTask = (e: Event) => {
  const target = e.target as HTMLElement
  if (Array.from(taskComponents.value).some((comp) => comp.contains(target)))
    return

  selectedTasks.value = []
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
    v-if="!!result?.todoes.length"
    class="py-8 grid grid-cols-[repeat(auto-fit,minmax(200px,350px))] gap-4"
  >
    <task-vue
      v-for="(todo, index) in result?.todoes"
      :key="todo.id"
      :task-data="todo"
      @click="handleTaskClick($event, todo, index)"
      :is-selected="
        selectedTasks.some((selectedTask) => selectedTask.id === todo.id)
      "
    />
  </div>

  <div
    v-else
    class="h-full grid place-content-center text-blue opacity-50 text-center"
  >
    <span class="fas fa-folder-open text-4xl mb-4" />
    <span class="text-lg"> You dont have any tasks.</span>
    <span>Enjoy the weekend bro!</span>
  </div>

  <modal-vue
    :visible="createTask"
    @close="createTask = false"
    @ok="createTaskRef?.submit()"
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
        <button class="button-2nd danger-2nd">
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
