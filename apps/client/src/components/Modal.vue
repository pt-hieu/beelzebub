<script lang="ts" setup>
import { ref, watch } from 'vue'
import MotionVue from './Motion.vue'
import Loading from './Loading.vue'
import { useTrapFocus } from '../composables/useTrapFocus.js'

type Props = {
  visible: boolean
  isLoading?: boolean
  okText?: string
  title?: string
  id?: string
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
      class="fixed z-10 w-screen h-screen top-0 left-0 bg-black/40 grid place-content-center"
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
          class="bg-white rounded-lg min-w-[450px] p-5 shadow-md"
        >
          <slot name="header">
            <div class="flex justify-between my-2 px-2">
              <div class="text-blue font-medium text-lg">
                {{ title }}
              </div>

              <button @click="emit('close')" class="fa fa-times" />
            </div>
          </slot>

          <div
            v-bind="$attrs"
            class="max-h-[500px] min-h-[40px] overflow-auto px-2"
          >
            <slot />
          </div>

          <slot name="footer">
            <div
              class="flex gap-2 items-center justify-end mt-4 border-t border-black/10 pt-4"
              id="footer-container"
            >
              <button class="button-3rd order-2" @click="emit('close')">Cancel</button>

              <button class="button order-3" @click="emit('ok')">
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
