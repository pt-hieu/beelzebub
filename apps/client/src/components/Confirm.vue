<script lang="ts" setup>
import type { ModalButton } from '../types'
import ModalVue from './Modal.vue'

type Props = {
  okText?: string
  title?: string
  disabledModal?: boolean
  disabled?: boolean
  message: string
  ndButtons?: ModalButton[]
}

const {
  okText = 'Ok',
  title = 'Warning',
  message,
  disabledModal = false,
  disabled = false,
  ndButtons = [],
} = defineProps<Props>()
const emit = defineEmits(['ok', 'cancel'])

let visible = $ref(false)

defineExpose({
  close: () => (visible = false),
  open: () => (visible = true),
})

const handleContainerClick = () => {
  if (disabled) return

  if (disabledModal) {
    emit('ok')
    return
  }

  visible = true
}

const handleOkButtonClick = () => {
  emit('ok')
  visible = false
}

const handleCancelButtonClick = () => {
  emit('cancel')
  visible = false
}
</script>

<template>
  <modal-vue
    :visible="visible"
    :title="title"
    :ok-text="okText"
    :nd-buttons="ndButtons"
    @ok="handleOkButtonClick"
    @close="handleCancelButtonClick"
  >
    <span class="dark:text-white/80">
      {{ message }}
    </span>
  </modal-vue>

  <div @click="handleContainerClick" v-bind="$attrs">
    <slot></slot>
  </div>
</template>
