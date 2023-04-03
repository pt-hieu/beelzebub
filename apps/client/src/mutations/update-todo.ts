import type { Model } from '@beelzebub/types'
import { useMutation } from '@vue/apollo-composable'

import { useToast } from '../pinia/toast'
import { UPDATE_TODO } from '../queries/todo.js'

type UseUpdateTaskOptions = {}

type UpdateTaskOptions = { updateOnlyTarget: boolean }

export const UPDATE_TASK_TOAST_ID = 'update-task'
export const useUpdateTask = (options: UseUpdateTaskOptions = {}) => {
  const toast = useToast()

  const {
    mutate,
    loading: updating,
    onDone: onUpdated,
    onError: onUpdateFailed,
  } = useMutation<
    any,
    {
      id: string
      input: Partial<Omit<Model.Todo, keyof Model.Base | 'meta'>>
      options?: UpdateTaskOptions
    }
  >(UPDATE_TODO)

  onUpdateFailed(() => {
    toast.add('Task failed to update', 'Error', UPDATE_TASK_TOAST_ID, 2)
  })

  onUpdated(() => {
    toast.add('Task updated', 'Success', UPDATE_TASK_TOAST_ID, 2)
  })

  const update: typeof mutate = (...args) => {
    return mutate(...args)
  }

  return { update, updating }
}
