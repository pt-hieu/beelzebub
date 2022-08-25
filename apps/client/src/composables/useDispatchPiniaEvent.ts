import { usePiniaEvent } from '@/pinia/event'

export function useDispatchPiniaEvent<K extends keyof PiniaEvent>(): (
  payload: PiniaEvent[K],
  eventName: K,
) => void
export function useDispatchPiniaEvent<K extends keyof PiniaEvent>(
  name?: K,
): (payload: PiniaEvent[K], eventName?: K) => void {
  const event = usePiniaEvent()

  return (payload, eventName) => {
    return event.dispatch(name! || eventName!, payload)
  }
}
