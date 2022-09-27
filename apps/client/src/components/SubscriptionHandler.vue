<script lang="ts" setup>
import { onUnmounted, watch } from 'vue'
import { useMessageEvent } from '@/pinia/message-event'
import type { Event } from '@beelzebub/types'
import { useRouter } from 'vue-router'

const messageEvent = useMessageEvent()
const { currentRoute } = useRouter()

let subscription = $ref<EventSource | undefined>(undefined)

// FixMe
watch(
  () => currentRoute.value.query.remindId,
  (remindId) => {
    subscription?.close()

    let url = `${import.meta.env.VITE_API}/subscribe`

    if (remindId) {
      url += `?channel=${remindId}`
    }

    const es = new EventSource(url)

    es.addEventListener('message', (ev) => {
      const data = JSON.parse(ev.data) as Event.SSE
      messageEvent.set(data)
    })

    es.addEventListener('open', () => {
      console.info('Connection to SSE server established!')
    })

    es.addEventListener('error', () => {
      console.error('SSE server disconnected!')
    })

    subscription = es
  },
  { immediate: true },
)

onUnmounted(() => {
  subscription?.close()
})
</script>

<template>
  <span></span>
</template>
