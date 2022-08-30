<script lang="ts" setup>
import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable'
import { useOnSseEvent } from '../composables/useOnSseEvent.js'
import FooterVue from '@/components/Footer.vue'
import { DELETE_LINK, GET_LINKS, type GetLinksRes } from '../queries/link.js'
import MutateLinkModal from '../components/MutateLinkModal.vue'
import LinkItem from '../components/LinkItem.vue'
import Confirm from '../components/Confirm.vue'
import Loading from '../components/Loading.vue'
import { useToast } from '../pinia/toast.js'
import { toRaw } from 'vue'

const { result } = useQuery<GetLinksRes>(GET_LINKS)

const apollo = useApolloClient()
useOnSseEvent('link.crawl.1', (links) => {
  const cache = apollo.client.cache
  const data = cache.readQuery<GetLinksRes>({ query: GET_LINKS })

  const linkMap = new Map([
    ...(data?.links.map((link) => [link.id, link] as const) || []),
    ...(links.map(
      (link) => [link.id, { ...toRaw(link), __typename: 'LinkModel' }] as const,
    ) || []),
  ])

  const final = Array.from(linkMap.values())

  console.log({ links, data: data?.links, final })

  cache.writeQuery({
    query: GET_LINKS,
    data: { links: final },
  })
})

let mutateLinkVisible = $ref(false)
let selectedLinkId = $ref<string | undefined>()

const selectedLink = $computed(() =>
  result.value?.links.find((link) => link.id === selectedLinkId),
)

const toast = useToast()
const DELETE_LINK_TOAST_ID = 'delete-link'

const {
  mutate: del,
  loading: deleting,
  onDone: onDeleted,
  onError: onDeleteFailed,
} = useMutation(DELETE_LINK, {
  update: (cache, { data: { deleteLink } }) => {
    let data = cache.readQuery<GetLinksRes>({ query: GET_LINKS })

    if (data) {
      data = {
        links: data.links.filter((link) => link.id !== deleteLink.id),
      }

      cache.writeQuery({ query: GET_LINKS, data })
    }
  },
})

onDeleted(() => {
  selectedLinkId = undefined
  toast.add('Link deleted', 'Success', DELETE_LINK_TOAST_ID, 2)
})

onDeleteFailed(() => {
  toast.add('Link failed to delete', 'Error', DELETE_LINK_TOAST_ID, 2)
})
</script>

<template>
  <div class="py-4 grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-3">
    <link-item
      v-for="link in result?.links"
      :data="link"
      :key="link.id"
      @chosen="(id) => (selectedLinkId = id)"
      :selected="selectedLinkId === link.id"
    />
  </div>

  <mutate-link-modal
    :visible="mutateLinkVisible"
    @close="
      () => {
        selectedLinkId = undefined
        mutateLinkVisible = false
      }
    "
    :link-data="selectedLink"
  />

  <footer-vue>
    <confirm
      message="You are deleting a shortened link!"
      :disabled="!selectedLinkId || deleting"
      @ok="del({ id: selectedLinkId })"
      ok-text="Delete"
    >
      <button :disabled="!selectedLinkId || deleting" class="button-2nd">
        <loading :is-loading="deleting" class="relative top-0.5 mr-2">
          <span class="fa fa-trash mr-2" />
        </loading>

        Delete
      </button>
    </confirm>

    <button @click="mutateLinkVisible = true" class="button-2nd">
      <span v-if="!selectedLinkId" class="fa fa-add mr-2" />
      <span v-else class="fa fa-edit mr-2" />

      {{ selectedLinkId ? 'Update' : 'Add New' }}
    </button>
  </footer-vue>
</template>
