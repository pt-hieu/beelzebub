<script lang="ts" setup>
import { onUnmounted, watch } from 'vue'
import { useMessageEvent } from '@/pinia/message-event'
import type { Event } from '@beelzebub/types'
import { useRouter } from 'vue-router'

import { useOnPiniaEvent } from '../composables/useOnPiniaEvent.js'

const messageEvent = useMessageEvent()
const { currentRoute } = useRouter()

let subscriptionDict = $ref(new Map<string, EventSource>())

function subscribeChannel(channel: string) {
  const subscription = subscriptionDict.get(channel)
  subscription?.close()

  let url = `${import.meta.env.VITE_API}/subscribe`
  if (channel) {
    url += `?channel=${channel}`
  }

  const es = new EventSource(url)

  es.addEventListener('message', (ev) => {
    const data = JSON.parse(ev.data) as Event.SSE
    messageEvent.set(data)
  })

  es.addEventListener('open', () => {
    console.info(
      `Connection to SSE server established! - [channel: ${
        channel || 'Public'
      }]`,
    )

    subscriptionDict.set(channel, es)
  })

  es.addEventListener('error', () => {
    console.error(
      `SSE server disconnected! - [channel: ${channel || 'Public'}]`,
    )

    es.close()
  })
}

watch(
  () => currentRoute.value.query.remindId,
  (remindId) => {
    if (typeof remindId === 'string') {
      subscribeChannel(remindId || '')
    }
  },
  { immediate: true },
)

useOnPiniaEvent('close-sse', (channel) => {
  const subscription = subscriptionDict.get(channel || '')

  subscription?.close()
  subscriptionDict.delete(channel || '')
})

onUnmounted(() => {
  Array.from(subscriptionDict.values()).forEach((es) => {
    es.close()
  })
})
</script>

<template>
  <span></span>
</template>
