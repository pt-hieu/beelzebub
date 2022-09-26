<script lang="ts" setup>
import { markRaw, onUnmounted } from 'vue'
import { useMessageEvent } from '@/pinia/message-event'
import type { Event } from '@beelzebub/types'

const messageEvent = useMessageEvent()

let subscription = markRaw<EventSource>(
  new EventSource(`${import.meta.env.VITE_API}/subscribe`),
)

subscription.onmessage = (ev) => {
  const data = JSON.parse(ev.data) as Event.SSE
  messageEvent.set(data)
}

subscription.addEventListener('open', () => {
  console.info('Connection to SSE server established!')
})

subscription.addEventListener('error', () => {
  console.error('SSE server disconnected!')
})

onUnmounted(() => {
  subscription.close()
})
</script>

<template>
  <span></span>
</template>
