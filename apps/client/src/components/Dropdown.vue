<script lang="ts" setup>
import { onUnmounted, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

type Props = {
  hold?: boolean
}

const props = defineProps<Props>()

const target = ref<HTMLButtonElement | null>(null)
const overlay = ref<HTMLDivElement | null>(null)

const visible = ref(false)

const stop = onClickOutside(
  target,
  () => {
    visible.value = false
  },
  { ignore: props.hold ? [overlay] : undefined },
)

onUnmounted(() => {
  stop?.()
})

const top = ref('0px')
const left = ref('0px')
const transform = ref('unset')

watch([visible, props], ([visible, props]) => {
  if (!visible) return

  if (!target.value) return
  if (!overlay.value) return

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  )
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  )

  const { top: eTop, left: eLeft } = target.value.getBoundingClientRect()

  const isFirstQuater = eTop < vh / 2 && eLeft < vw / 2
  const isSecondQuater = eTop < vh / 2 && eLeft >= vw / 2
  const isThirdQuater = eTop >= vh / 2 && eLeft < vw / 2
  const isFourthQuater = eTop >= vh / 2 && eLeft >= vw / 2

  if (isFirstQuater) {
    top.value = `calc(100%)`
  }

  if (isSecondQuater) {
    top.value = `calc(100%)`
    left.value = `calc(100%)`
    transform.value = `translateX(-100%)`
  }

  if (isThirdQuater) {
    top.value = '-4px'
    transform.value = `translate(0, -100%)`
  }

  if (isFourthQuater) {
    left.value = '100%'
    top.value = '-4px'
    transform.value = `translate(-100%, -100%)`
  }
})
</script>

<template>
  <div class="relative">
    <button ref="target" @click="visible = !visible">
      <slot />
    </button>

    <div
      :style="{ top, left, transform }"
      v-show="visible"
      class="absolute z-[1000]"
      ref="overlay"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>
