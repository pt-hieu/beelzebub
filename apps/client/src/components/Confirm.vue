<script lang="ts" setup>
import { ref } from 'vue'
import ModalVue from './Modal.vue'

type Props = {
  okText?: string
  title?: string
  message: string
}

const { okText, title, message } = defineProps<Props>()
const emit = defineEmits(['ok'])

const visible = ref(false)

defineExpose({
  close: () => (visible.value = false),
})
</script>

<template>
  <modal-vue
    :visible="visible"
    :title="title || 'Warning'"
    :ok-text="okText || 'Ok'"
    @ok="emit('ok')"
    @close="visible = false"
  >
    {{ message }}
  </modal-vue>

  <div @click="visible = true">
    <slot></slot>
  </div>
</template>
