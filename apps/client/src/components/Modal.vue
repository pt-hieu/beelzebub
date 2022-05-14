<script lang="ts" setup>
type Props = {
  visible: boolean
  okText?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'ok'])
</script>

<template>
  <teleport to="body">
    <div
      v-show="props.visible"
      class="fixed z-10 w-screen h-screen top-0 left-0 bg-black/40 grid place-content-center"
      @click="emit('close')"
    >
      <div
        @click="$event.stopPropagation()"
        class="bg-white rounded-md min-w-[450px] p-5 shadow-md"
      >
        <slot name="header"> </slot>

        <div>
          <slot />
        </div>

        <slot name="footer">
          <div class="flex gap-2 items-center justify-end mt-4">
            <button class="button" @click="emit('ok')">
              <span class="fa fa-check mr-2" />{{ props.okText || 'Submit' }}
            </button>

            <button class="button-2nd" @click="emit('close')">
              <span class="fa fa-times mr-2" />Cancel
            </button>
          </div>
        </slot>
      </div>
    </div>
  </teleport>
</template>
