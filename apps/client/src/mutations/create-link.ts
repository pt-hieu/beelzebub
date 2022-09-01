import { useMutation } from '@vue/apollo-composable'
import { useToast } from '../pinia/toast.js'
import { CREATE_LINK, GET_LINKS, type GetLinksRes } from '../queries/link.js'

export const CREATE_LINK_TOAST_ID = 'create-link'
export const useCreateLink = () => {
  const toast = useToast()

  const {
    mutate: create,
    loading: creating,
    onDone: onCreated,
    onError: onCreateFailed,
  } = useMutation(CREATE_LINK, {
    update: (cache, { data: { createLink } }) => {
      let data = cache.readQuery<GetLinksRes>({ query: GET_LINKS })
      data = {
        links: [createLink, ...(data?.links || [])],
      }

      cache.writeQuery({ query: GET_LINKS, data })
    },
  })

  onCreated(() => {
    toast.add('Link created', 'Success', CREATE_LINK_TOAST_ID, 2)
  })

  onCreateFailed(() => {
    toast.add('Link failed to create', 'Error', CREATE_LINK_TOAST_ID, 2)
  })

  return { create, creating }
}
