<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { onMounted, onUnmounted } from 'vue'

let todo = $ref<Model.Todo>()
let bc = $ref(new BroadcastChannel('beelzebub'))

onMounted(() => {
  bc.onmessage = (e) => {
    console.log(e)
  }
})

onUnmounted(bc.close)
</script>

<template>
  <template v-if="!!todo">
    {{ JSON.stringify(todo) }}
  </template>
</template>
