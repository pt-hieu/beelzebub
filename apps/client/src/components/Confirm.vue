<script lang="ts" setup>
import ModalVue from './Modal.vue'

type Props = {
  okText?: string
  title?: string
  disabled?: boolean
  message: string
}

const {
  okText = 'Ok',
  title = 'Warning',
  message,
  disabled = false,
} = defineProps<Props>()
const emit = defineEmits(['ok'])

let visible = $ref(false)

defineExpose({
  close: () => (visible = false),
})

const handleContainerClick = () => {
  if (disabled) {
    emit('ok')
    return
  }

  visible = true
}

const handleOkButtonClick = () => {
  emit('ok')
  visible = false
}
</script>

<template>
  <modal-vue
    :visible="visible"
    :title="title"
    :ok-text="okText"
    @ok="handleOkButtonClick"
    @close="visible = false"
  >
    {{ message }}
  </modal-vue>

  <div @click="handleContainerClick" v-bind="$attrs">
    <slot></slot>
  </div>
</template>
