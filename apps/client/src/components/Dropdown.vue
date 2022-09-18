<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import {
  onUnmounted,
  ref,
  watch,
  type Component,
  type HTMLAttributes,
} from 'vue'
import { onClickOutside } from '@vueuse/core'

import zIndex from '../libs/z-index'
import { findQuater } from '../libs/viewport.js'

type Props = {
  hold?: boolean
  containerAttrs?: HTMLAttributes
  as: string | Component
}

const { as, hold, containerAttrs } = defineProps<Props>()

const target = ref<HTMLElement>()
const overlay = ref<HTMLDivElement>()

const visible = ref(false)

const stop = onClickOutside(
  target,
  () => {
    visible.value = false
  },
  { ignore: hold ? [overlay] : undefined },
)

onUnmounted(() => {
  stop?.()
})

const top = ref('0px')
const left = ref('0px')
const transform = ref('unset')

watch([visible], ([visible]) => {
  if (!visible) return

  if (!target.value) return
  if (!overlay.value) return

  const { top: eTop, left: eLeft } = target.value.getBoundingClientRect()

  const { q1, q2, q3, q4 } = findQuater({ left: eLeft, top: eTop })

  if (q1) {
    top.value = `calc(100%)`
  }

  if (q2) {
    top.value = `calc(100% + 4px)`
    left.value = `calc(100%)`
    transform.value = `translateX(-100%)`
  }

  if (q3) {
    top.value = '-4px'
    transform.value = `translate(0, -100%)`
  }

  if (q4) {
    left.value = '100%'
    top.value = '-4px'
    transform.value = `translate(-100%, -100%)`
  }
})
</script>

<template>
  <div class="relative" v-bind="containerAttrs">
    <component
      :is="as"
      ref="target"
      @click="visible = !visible"
      v-bind="$attrs"
    >
      <slot />
    </component>

    <div
      :style="{ top, left, transform }"
      v-show="visible"
      :class="['absolute', zIndex.DROPDOWN_OVERLAY]"
      ref="overlay"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>
