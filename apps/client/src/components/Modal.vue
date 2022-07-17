<script lang="ts" setup>
import { ref, watch } from 'vue'
import MotionVue from './Motion.vue'
type Props = {
  visible: boolean
  okText?: string
  title?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'ok'])

const internalVisible = ref(props.visible)
watch(
  () => props.visible,
  (visible) => {
    if (visible) internalVisible.value = visible
  },
)
</script>

<template>
  <teleport to="body">
    <motion-vue
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
            transition: {
              delay: 130,
              duration: 100,
            },
          },
          leave: { opacity: 0, transition: { duration: 100 } },
        }"
      >
        <div
          @click="$event.stopPropagation()"
          class="bg-white rounded-lg min-w-[450px] p-5 shadow-md"
        >
          <slot name="header">
            <div class="flex justify-between my-2 px-2">
              <div>{{ props.title }}</div>

              <button @click="emit('close')" class="fa fa-times" />
            </div>
          </slot>

          <div class="max-h-[500px] min-h-[40px] overflow-auto px-2">
            <slot />
          </div>

          <slot name="footer">
            <div
              class="flex gap-2 items-center justify-end mt-4 border-t border-black/10 pt-4"
            >
              <button class="button-3rd" @click="emit('close')">Cancel</button>

              <button class="button" @click="emit('ok')">
                <span class="fa fa-check mr-2" />{{ props.okText || 'Submit' }}
              </button>
            </div>
          </slot>
        </div>
      </motion-vue>
    </motion-vue>
  </teleport>
</template>
