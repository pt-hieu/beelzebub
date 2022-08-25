import { computed, unref, watch } from 'vue'
import { usePiniaEvent } from '../pinia/event.js'

export function useOnPiniaEvent<K extends keyof PiniaEvent>(
  name: K,
  cb: (payload: PiniaEvent[K] | undefined) => void,
) {
  const event = usePiniaEvent()
  const eventPayload = computed(() => event.getEvent(name))

  watch(
    eventPayload,
    (payload) => {
      cb(unref(payload)?.data)
    },
    { immediate: false },
  )
}
