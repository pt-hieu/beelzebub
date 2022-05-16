<script lang="ts" setup>
import type { Model } from '@black/share'
type Props = {
  data: Model.Todo
}

const props = defineProps<Props>()
</script>

<template>
  <button class="rounded-lg p-4 border border-blue overflow-hidden h-fit">
    <div
      class="bg-blue -m-4 px-4 py-3 text-white grid grid-cols-[70px,1fr] items-center gap-2"
    >
      <div class="truncate text-left">{{ props.data.title }}</div>

      <div class="flex justify-end gap-2">
        <div
          v-for="cate in props.data.categorization"
          :key="cate"
          class="py-1 px-2 border rounded-md border-white w-fit"
        >
          {{ cate }}
        </div>
      </div>
    </div>
  </button>
</template>
