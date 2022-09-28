import { usePiniaEvent } from '@/pinia/event'

export function useDispatchPiniaEvent<K extends keyof PiniaEvent>(): (
  eventName: K,
  payload: PiniaEvent[K],
) => void
export function useDispatchPiniaEvent<K extends keyof PiniaEvent>(
  name: K,
): (payload: PiniaEvent[K]) => void
export function useDispatchPiniaEvent<K extends keyof PiniaEvent>(
  name?: K,
): (eventName: K | PiniaEvent[K], payload?: PiniaEvent[K]) => void {
  const event = usePiniaEvent()

  return (eventNameOrPayload, payload) => {
    return event.dispatch(
      // @ts-expect-error
      name! || eventNameOrPayload!,
      payload || eventNameOrPayload,
    )
  }
}
