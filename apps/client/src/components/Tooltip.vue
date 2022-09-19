<script lang="ts" setup>
import {
  onMounted,
  reactive,
  watchEffect,
  type Component,
  type CSSProperties,
} from 'vue'
import { useElementHover } from '@vueuse/core'

import { findQuater } from '../libs/viewport'

type Props = {
  as: string | Component
  text: string
  movable?: boolean
}

const { as, text, movable = false } = defineProps<Props>()

const eleRef = $ref<HTMLElement>()
const textRef = $ref<HTMLDivElement>()

const isHover = $(useElementHover($$(eleRef)))

const style = reactive<CSSProperties>({
  left: '0px',
  top: '0px',
  transform: 'unset',
  visibility: 'hidden',
})

const resetStyle = () => {
  style.left = '0px'
  style.top = '0px'
  style.transform = 'unset'
}

const calcStyle = () => {
  const { top, left, right, width } = eleRef.getBoundingClientRect()
  const text = textRef.getBoundingClientRect()

  const { q1, q2, q3, q4 } = findQuater({ top, left })

  let offset = '0px'
  if (q1) {
    style.top = 'calc(100% + 4px)'

    if (left < text.width / 2) {
      offset = Math.abs(left - text.width / 2) + 16 + 'px'
    }

    style.transform = `translateX(calc(-50% + ${offset} + ${width}px / 2))`
  }

  if (q2) {
    style.top = '100%'
    style.left = '100%'

    if (text.width / 2 > right) {
      offset = Math.abs(right - text.right / 2) + 16 + 'px'
    }

    style.transform = `translateX(calc(-50% + ${offset} + ${width}px / 2))`
  }

  if (q3) {
    if (left < text.width / 2) {
      offset = Math.abs(left - text.width / 2) + 16 + 'px'
    }

    style.transform = `translate(calc(-50% + ${offset} + ${width}px / 2), -100%)`
  }

  if (q4) {
    style.left = '100%'

    if (text.width / 2 > right) {
      offset = Math.abs(right - text.right / 2) + 16 + 'px'
    }

    style.transform = `translate(calc(-50% + ${offset} + ${width}px / 2), -100%)`
  }
}

watchEffect(
  () => {
    style.visibility = isHover ? 'unset' : 'hidden'
    if (!isHover || !movable) return

    resetStyle()
    calcStyle()
  },
  { flush: 'post' },
)

onMounted(calcStyle)
</script>

<template>
  <component ref="eleRef" :is="as" class="relative">
    <slot />

    <div
      ref="textRef"
      :style="style"
      :class="[
        'absolute w-max max-w-[200px] p-2 px-4 bg-white',
        'rounded-md shadow-md text-blue text-sm',
        'ring-1 ring-blue',
      ]"
    >
      {{ text }}
    </div>
  </component>
</template>
