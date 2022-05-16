<script lang="ts" setup>
import { ref, watch } from 'vue'
import { isEqual, sortBy } from 'lodash'
import TaskVue from '@/components/Task.vue'
import type { Model } from '@black/share'

type Props = {
  cate: Model.TodoCategorization[]
  todoes: Model.Todo[]
}

const props = defineProps<Props>()
const todoes = ref<Model.Todo[]>([])

watch(
  () => props.todoes,
  (newTodoes) => {
    todoes.value = newTodoes.filter(({ categorization }) =>
      isEqual(sortBy(categorization), sortBy(props.cate)),
    )
  },
)
</script>

<template>
  <div class="p-4 grid grid-cols-2 gap-3">
    <task-vue v-for="todo in todoes" :key="todo.id" :data="todo" />
  </div>
</template>
