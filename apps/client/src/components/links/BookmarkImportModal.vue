<script lang="ts" setup>
import { readBinaryFile } from '@tauri-apps/api/fs'
import { watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'

import Modal from '../Modal.vue'
import KeyCode from '../KeyCode.vue'
import Loading from '../Loading.vue'

import { open } from '../../dialog.js'
import { IMPORT_LINK } from '../../queries/link.js'
import { useToast } from '../../pinia/toast.js'

type Props = {
  visible: boolean
}

const { visible } = defineProps<Props>()
const emit = defineEmits(['close'])

let choosingFile = $ref(false)
let targetFile = $ref<File | undefined>(undefined)

async function chooseFile() {
  const path = await open({ strict: true, multiple: false, directory: false })
  if (!path) return

  choosingFile = true
  const uint8Array = await readBinaryFile(path)
  const filename = path.split(/\/|\\|\/\//).slice(-1)[0]

  targetFile = new File([new Blob([uint8Array])], filename)
  choosingFile = false
}

watch(
  () => visible,
  (v) => {
    setTimeout(() => {
      targetFile = undefined
    }, 300)
  },
)

const toast = useToast()

const { loading: importing, mutate, onDone, onError } = useMutation(IMPORT_LINK)
const IMPORTING_LINK_TOAST_ID = 'import-link'

function startImporting() {
  if (!targetFile) return

  toast.add('Importing link from bookmarks', 'Working', IMPORTING_LINK_TOAST_ID)
  emit('close')

  mutate({ source: 'CHROME', file: targetFile })
}

onDone(() => {
  toast.add('Bookmarks imported', 'Success', IMPORTING_LINK_TOAST_ID, 2)
})

onError(() => {
  toast.add('Bookmarks import failed', 'Error', IMPORTING_LINK_TOAST_ID, 2)
})
</script>

<template>
  <modal
    title="Import Link From Bookmark"
    :visible="visible"
    :is-loading="importing"
    @close="emit('close')"
    @ok="startImporting"
    :ok-disabled="!targetFile"
  >
    <div class="flex flex-col items-center gap-6 mb-1">
      <div class="text-xs w-full">
        Please be noticed that, only files from
        <key-code
          class="inline-flex !text-xs"
          :keys="'Downloads'"
          :deli="'/'"
        />
        and
        <key-code class="inline-flex !text-xs" :keys="'Desktop'" :deli="'/'" />
        can be uploaded.
      </div>

      <div class="grid place-content-center w-full h-[96px]">
        <loading v-if="!targetFile" :is-loading="choosingFile">
          <button
            @click="chooseFile"
            title="Choose file"
            class="w-[96px] aspect-square ring-1 ring-blue rounded-full text-blue hover:ring-offset-2 duration-150"
          >
            <span class="fa fa-upload" />
          </button>
        </loading>

        <div v-else class="text-blue">
          <span class="fa fa-file mr-2" /> {{ targetFile.name }}
          <button @click="targetFile = undefined" class="ml-2">
            <span class="fa fa-times" />
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>
