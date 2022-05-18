<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'
import FooterVue from '../components/Footer.vue'
import ModalVue from '../components/Modal.vue'
import CreateTaskVue from '../components/CreateTask.vue'
import { GET_TODOES, type GetTodoesRes } from '@/queries/todo'
import TaskVue from '../components/Task.vue'
import DropdownVue from '../components/Dropdown.vue'

const { result } = useQuery<GetTodoesRes>(GET_TODOES)

const createTask = ref(false)
const createTaskRef = ref<InstanceType<typeof CreateTaskVue> | null>(null)

const filter = ref<string[]>([])

watch(createTask, () => {
  if (!createTask.value) return
  createTaskRef.value?.reset()
})
</script>

<template>
  <div class="py-8 grid grid-cols-[repeat(auto-fit,minmax(200px,350px))] gap-4">
    <task-vue v-for="todo in result?.todoes" :key="todo.id" :data="todo" />
  </div>

  <modal-vue
    :visible="createTask"
    @close="createTask = false"
    @ok="createTaskRef?.submit()"
  >
    <create-task-vue @done="createTask = false" ref="createTaskRef" />
  </modal-vue>

  <teleport to="#app">
    <footer-vue>
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
  </teleport>
</template>
