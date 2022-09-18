import { listen } from '@tauri-apps/api/event'
import { customRef, onMounted, onUnmounted } from 'vue'

declare global {
  type Await<T> = T extends Promise<infer U> ? U : unknown
}

export function useWindowResize() {
  let unlisten = $ref<Await<ReturnType<typeof listen>> | undefined>(undefined)

  const ref = customRef<number>((track, trigger) => {
    let value = Math.random() * Date.now()

    return {
      get() {
        track()
        return value
      },
      set(_v) {
        value = Math.random() * Date.now()

        setTimeout(() => {
          trigger()
        }, 100)
      },
    }
  })

  onMounted(async () => {
    unlisten = await listen('tauri://resize', () => {
      ref.value = 1
    })
  })

  onUnmounted(() => {
    unlisten?.()
  })

  return ref
}
