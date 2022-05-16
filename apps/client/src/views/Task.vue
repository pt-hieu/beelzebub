<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { ref, watchEffect } from 'vue'
import FooterVue from '../components/Footer.vue'
import ModalVue from '../components/Modal.vue'
import CreateTaskVue from '../components/CreateTask.vue'
import { GET_TODOES, type GetTodoesRes } from '@/queries/todo'

const { result } = useQuery<GetTodoesRes>(GET_TODOES)

const createTask = ref(false)
const createTaskRef = ref<InstanceType<typeof CreateTaskVue> | null>(null)

watchEffect(() => {
  if (!createTask.value) return
  createTaskRef.value?.reset()
})
</script>

<template>
  <div
    class="grid grid-cols-[70px,1fr,1fr] grid-rows-[60px,1fr,1fr] min-h-[calc(100vh-140px)] divide-x divide-y divide-blue/20 py-8"
  >
    <div />

    <div class="grid place-content-center">Important</div>
    <div class="grid place-content-center">!Important</div>

    <div class="grid place-content-center">Urgent</div>

    <div>{{ result }}</div>

    <div></div>

    <div class="grid place-content-center">!Urgent</div>

    <div></div>

    <div></div>
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
      <button @click="createTask = true" class="button-2nd">
        <span class="fa fa-plus mr-2" />Add Task
      </button>
    </footer-vue>
  </teleport>
</template>
