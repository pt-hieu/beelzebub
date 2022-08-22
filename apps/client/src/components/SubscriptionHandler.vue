<script lang="ts" setup>
import { markRaw, onMounted, onUnmounted } from 'vue'
import { useMessageEvent } from '@/stores/message-event'
import type { Event } from '@beelzebub/types'

const messageEvent = useMessageEvent()

let subscription = markRaw<EventSource>(
  new EventSource(`${import.meta.env.VITE_API}/subscribe`),
)

subscription.onmessage = (ev) => {
  console.log(ev)

  const data = JSON.parse(ev.data) as Event.SSE
  messageEvent.set(data)
}

subscription.addEventListener('open', () => {
  console.log('EventSource Opened')
})

subscription.addEventListener('error', () => {
  console.log('EventSource Failed')
})

onUnmounted(() => {
  subscription.close()
})
</script>

<template>
  <span></span>
</template>
