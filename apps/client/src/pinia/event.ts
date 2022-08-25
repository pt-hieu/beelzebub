import { defineStore } from 'pinia'

declare global {
  interface PiniaEvent {
    [x: string]: unknown
  }
}

type EventStore = {
  data: {
    [name in keyof PiniaEvent]?: {
      data?: PiniaEvent[name]
      timestamp: number
    }
  }
}

export const usePiniaEvent = defineStore<
  'event',
  EventStore,
  {
    getEvent: () => <K extends keyof PiniaEvent>(
      eventName: K,
    ) => { data?: PiniaEvent[K]; timestamp: number } | undefined
  },
  {
    dispatch: <K extends keyof PiniaEvent>(
      name: K,
      payload: PiniaEvent[K],
    ) => void
  }
>('event', {
  state() {
    return {
      data: {},
    }
  },
  getters: {
    getEvent() {
      return (name) => {
        return this.data[name]
      }
    },
  },
  actions: {
    dispatch(name, payload) {
      this.data[name] = {
        data: payload,
        timestamp: Date.now(),
      }
    },
  },
})
