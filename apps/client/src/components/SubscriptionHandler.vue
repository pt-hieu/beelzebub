<script lang="ts" setup>
import { markRaw, onUnmounted } from 'vue'
import { useMessageEvent } from '@/stores/message-event'
import type { Event } from '@beelzebub/types'
import { useToast } from '../stores/toast'

const messageEvent = useMessageEvent()
const toast = useToast()

let subscription = markRaw<EventSource>(
  new EventSource(`${import.meta.env.VITE_API}/subscribe`),
)

subscription.onmessage = (ev) => {
  const data = JSON.parse(ev.data) as Event.SSE
  messageEvent.set(data)
}

subscription.addEventListener('open', () => {
  toast.add('Connection to SSE server established!', 'Success', undefined, 2)
})

subscription.addEventListener('error', () => {
  toast.add('SSE server disconnected!', 'Error', undefined, 2)
})

onUnmounted(() => {
  subscription.close()
})
</script>

<template>
  <span></span>
</template>
