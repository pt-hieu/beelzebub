import { defineStore } from 'pinia'

type ToastActions = {
  label: string
  event: keyof PiniaEvent
  icon?: `fa fa-${string}`
}

type Toast = {
  id: number | string
  message: string
  type: 'Info' | 'Error' | 'Success' | 'Working'
  actions?: ToastActions[]
}

type ToastStore = {
  items: Toast[]
  timeout: Record<string | number, number>
}

function* id() {
  let start = 0

  while (1) {
    yield start++
  }
}

const idGenerator = id()

export const useToast = defineStore<
  'toast',
  ToastStore,
  {},
  {
    remove: (toastId: Toast['id']) => void
    add: (
      message: Toast['message'],
      type?: Toast['type'],
      id?: Toast['id'],
      /** in seconds */
      timeout?: number,
      actions?: Toast['actions'],
    ) => void
  }
>('toast', {
  state() {
    return {
      items: [],
      timeout: {},
    }
  },
  actions: {
    add(message, type = 'Success', id, timeout, actions = []) {
      const toastId = id || idGenerator.next().value || 0
      const toastIndex = this.items.findIndex((toast) => toast.id === toastId)

      this.timeout[toastId] && clearTimeout(this.timeout[toastId])

      if (timeout) {
        this.timeout[toastId] = setTimeout(() => {
          this.items = this.items.filter((toast) => toast.id !== toastId)
        }, timeout * 1000)
      }

      if (toastIndex > -1) {
        const toast = this.items[toastIndex]
        this.items.splice(toastIndex, 1, {
          ...toast,
          message,
          type,
          id: toastId,
          actions,
        })
      } else {
        this.items.push({ message, type, id: toastId, actions })
      }
    },
    remove(toastId) {
      this.timeout[toastId] && clearTimeout(this.timeout[toastId])
      this.items = this.items.filter((toast) => toast.id !== toastId)
    },
  },
})
