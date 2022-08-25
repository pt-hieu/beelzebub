import { defineStore } from 'pinia'
import type { Event } from '@beelzebub/types'

type MessageEventStore = {
  value: Event.SSE | undefined
}

export const useMessageEvent = defineStore<
  'message-event',
  MessageEventStore,
  {},
  {
    set: (value: Event.SSE) => void
  }
>('message-event', {
  state() {
    return {
      value: undefined,
    }
  },
  actions: {
    set(value) {
      this.value = value
    },
  },
})
