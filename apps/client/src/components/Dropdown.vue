<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const target = ref<HTMLDivElement | null>(null)
const visible = ref(false)

onClickOutside(target, () => {
  visible.value = false
})

const top = ref('0px')
onMounted(() => {
  top.value = (target.value?.getBoundingClientRect().width || 0) + 7 + 'px'
})
</script>

<template>
  <div class="relative">
    <button ref="target" @click="visible = !visible">
      <slot />
    </button>

    <div :style="{ top }" v-show="visible" class="absolute right-0">
      <slot name="overlay" />
    </div>
  </div>
</template>
