<script lang="ts" setup>
import SwitchVue from './Switch.vue'

const props = defineProps<{
  falseLabel: string
  trueLabel: string
  initialChecked?: boolean
  checked?: boolean
  disabled?: boolean
}>()

const emit = defineEmits({
  change: (_value: boolean) => true,
})
</script>

<template>
  <div class="flex gap-4 items-center">
    <span :class="`${checked || disabled ? 'opacity-30' : ''}`">{{ falseLabel }}</span>

    <switch-vue
      :initial-checked="initialChecked"
      :checked="checked"
      :disabled="disabled"
      @change="(value) => emit('change', value)"
    />

    <span :class="`${!checked || disabled ? 'opacity-30' : ''}`">{{ trueLabel }}</span>
  </div>
</template>
