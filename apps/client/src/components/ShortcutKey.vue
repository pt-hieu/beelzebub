<script lang="ts" setup>
type Props = {
  keys: string
}

const { keys } = defineProps<Props>()
const keyArray = $computed(() => keys.split('+'))
</script>

<template>
  <span class="flex gap-1 items-center select-none">
    <template v-for="(key, index) in keyArray" :key="key">
      <span class="p-1 px-2 bg-blue-tint text-white rounded">{{ key }}</span>
      <span class="text-blue" v-if="index !== keyArray.length - 1">+</span>
    </template>
  </span>
</template>
