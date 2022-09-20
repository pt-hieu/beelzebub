<script lang="ts" setup>
type Props = {
  keys: string
  deli: string
}

const { keys, deli = '+' } = defineProps<Props>()
const keyArray = $computed(() => keys.split(deli))
</script>

<template>
  <span class="flex gap-1 items-center select-none">
    <template v-for="(key, index) in keyArray" :key="key">
      <span
        class="p-1 px-2 bg-blue-tint text-white rounded dark:bg-$blue dark:border dark:border-cyan-tint dark:text-cyan-tint"
        >{{ key }}</span
      >
      <span
        class="text-blue dark:text-white/80"
        v-if="index !== keyArray.length - 1"
        >{{ deli }}</span
      >
    </template>
  </span>
</template>
