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
import { useOnPiniaEvent } from '../composables/useOnPiniaEvent.js'
import { isWeb } from '../libs/platform.js'
import { readText } from '@tauri-apps/api/clipboard'
import { useCreateLink } from '../mutations/create-link.js'
import BookmarkImportModal from '../components/BookmarkImportModal.vue'
import { open } from '@tauri-apps/api/shell'

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

  cache.writeQuery({
    query: GET_LINKS,
    data: { links: final },
  })
})

let mutateLinkVisible = $ref(false)
let importBookmarkVisible = $ref(false)
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

const { create } = useCreateLink()
useOnPiniaEvent('Control+Alt+Q', async () => {
  if (isWeb()) return
  const link = await readText()

  if (!link) {
    toast.add('Clipboard is empty', 'Info', undefined, 2)
    return
  }

  create({ dto: { url: link } })
})

async function openInBrowser() {
  if (!selectedLink) return
  await open(selectedLink.url)
}
</script>

<template>
  <div
    class="p-4 pt-1 grid grid-cols-[repeat(auto-fit,minmax(250px,270px))] gap-3 max-h-[calc(100vh-160px)] mt-4 overflow-auto"
  >
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

  <bookmark-import-modal
    :visible="importBookmarkVisible"
    @close="importBookmarkVisible = false"
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

    <button
      @click="openInBrowser"
      :disabled="!selectedLinkId"
      class="button-2nd"
    >
      <span class="fa fa-external-link mr-2" />
      Open
    </button>

    <button @click="mutateLinkVisible = true" class="button-2nd">
      <span v-if="!selectedLinkId" class="fa fa-add mr-2" />
      <span v-else class="fa fa-edit mr-2" />

      {{ selectedLinkId ? 'Update' : 'Add New' }}
    </button>

    <button @click="importBookmarkVisible = true" class="button-2nd">
      <span class="fa fa-file-import mr-2" />
      Import From Bookmark
    </button>
  </footer-vue>
</template>
