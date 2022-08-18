<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'

const props = defineProps<{
  initialChecked?: boolean
  checked?: boolean
  disabled?: boolean
}>()
const emit = defineEmits({
  change(_value: boolean) {
    return true
  },
})

const state = ref(props.initialChecked || false)

watchEffect(() => {
  emit('change', state.value)
})

watch(
  () => props.checked,
  (checked) => {
    state.value = checked || false
  },
)
</script>

<template>
  <button
    @click="state = !state"
    :disabled="disabled"
    :class="`relative ring-[2px] ring-blue w-[46px] h-[20px] rounded-full p-[2px] ${
      state ? 'bg-blue' : ''
    } ${disabled ? 'bg-gray ring-gray' : ''}`"
  >
    <span
      :class="`inline-block h-4 aspect-square rounded-full relative ${
        state ? 'float-right bg-white' : 'float-left bg-blue'
      } ${disabled ? '!bg-white' : ''}`"
    />
  </button>
</template>
