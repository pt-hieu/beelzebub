import { useMessageEvent } from '@/stores/message-event'
import type { Event } from '@beelzebub/types'
import { watch } from 'vue'

export function useOnEvent<E extends Event.SSE['type']>(
  event: E,
  cb: (payload: Extract<Event.SSE, { type: E }>['payload']) => void,
) {
  const messageEvent = useMessageEvent()

  watch(
    () => messageEvent.value,
    (ev) => {
      if (!ev) return
      if (ev.type !== event) return

      cb(messageEvent.value!.payload as unknown as any)
    },
    { immediate: false },
  )
}
