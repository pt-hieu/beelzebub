<script lang="ts" setup>
import { useMotion, type MotionVariants } from '@vueuse/motion'
import { ref, watch } from 'vue'

type Props = {
  variants: MotionVariants
  flag: boolean
}

const props = defineProps<Props>()

const motionTarget = ref<HTMLDivElement | null>(null)
const motion = useMotion(motionTarget, props.variants)

defineExpose({ motion, motionTarget })
const emit = defineEmits(['leaveDone'])

watch(
  () => props.flag,
  async (flag) => {
    if (flag) {
      await motion.apply('enter')
      return
    }

    motion.leave(() => emit('leaveDone'))
  },
  { immediate: true },
)
</script>

<template>
  <div ref="motionTarget">
    <slot />
  </div>
</template>
