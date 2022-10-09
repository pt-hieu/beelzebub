<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { ModalButton } from '@/types'

import MotionVue from './Motion.vue'
import Loading from './Loading.vue'

import { useTrapFocus } from '../composables/useTrapFocus.js'
import zIndex from '../libs/z-index'

type Props = {
  visible: boolean
  isLoading?: boolean
  okText?: string
  title?: string
  id?: string
  okDisabled?: boolean
  ndButtons?: ModalButton[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'ok'])

const internalVisible = ref(props.visible)

let motionRef = $ref<InstanceType<typeof MotionVue> | null>(null)
const { trapRef } = useTrapFocus()

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      internalVisible.value = visible
      trapRef.value = motionRef?.motionTarget || null
    }

    if (!visible) {
      trapRef.value = null
    }
  },
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <teleport to="body">
    <motion-vue
      ref="motionRef"
      :id="id"
      v-show="internalVisible"
      :flag="props.visible"
      :variants="{
        initial: { opacity: 0 },
        enter: {
          opacity: 1,
          transition: {
            duration: 100,
          },
        },
        leave: { opacity: 0, transition: { duration: 100 } },
      }"
      :class="[
        'fixed w-screen h-screen top-0 left-0 bg-black/40 grid place-content-center',
        zIndex.MODAL_OVERLAY,
      ]"
      @click="emit('close')"
      @leave-done="internalVisible = false"
    >
      <motion-vue
        :flag="props.visible"
        :variants="{
          initial: { opacity: 0 },
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              delay: 130,
              duration: 100,
            },
          },
          leave: { opacity: 0, y: 70, transition: { duration: 100 } },
        }"
      >
        <div
          @click="$event.stopPropagation()"
          class="bg-white dark:bg-$blue rounded-lg min-w-[450px] p-5 shadow-md"
        >
          <slot name="header">
            <div class="flex justify-between my-2 px-2">
              <div class="text-blue dark:text-cyan-shade font-medium text-lg">
                {{ title }}
              </div>

              <button
                @click="emit('close')"
                class="fa fa-times dark:text-cyan-tint"
              />
            </div>
          </slot>

          <div
            v-bind="$attrs"
            class="max-h-[calc(100vh-144px-32px)] min-h-[40px] px-2 overflow-hidden"
          >
            <slot />
          </div>

          <slot name="footer">
            <div
              class="flex gap-2 items-center justify-end mt-4 border-t border-black/10 dark:border-cyan/10 pt-4"
              id="footer-container"
            >
              <button class="button-3rd font-medium" @click="emit('close')">
                Cancel
              </button>

              <button
                v-for="btn in props.ndButtons || []"
                :key="btn.text"
                @click="btn.onClick"
                class="button-2nd"
              >
                <loading :is-loading="btn.loading || false">
                  <span v-if="btn.icon" :class="`${btn.icon} mr-2`" />
                </loading>
                {{ btn.text }}
              </button>

              <button
                :disabled="okDisabled"
                class="button font-medium"
                @click="emit('ok')"
              >
                <loading :is-loading="isLoading || false">
                  <span class="fa fa-check mr-2" />
                </loading>

                {{ props.okText || 'Submit' }}
              </button>
            </div>
          </slot>
        </div>
      </motion-vue>
    </motion-vue>
  </teleport>
</template>
