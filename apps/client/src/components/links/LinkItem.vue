<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { writeText } from '@tauri-apps/api/clipboard'
import copy from 'copy-to-clipboard'
import { onLongPress } from '@vueuse/core'
import { open } from '@tauri-apps/api/shell'

import Loading from '../Loading.vue'

import { useToast } from '../../pinia/toast.js'
import { isWeb } from '../../libs/platform.js'

type Props = {
  data: Model.Link
  selected?: boolean
}

const { data, selected } = defineProps<Props>()
const emit = defineEmits({
  chosen: (_id: string | undefined) => true,
})

const toast = useToast()

const api = import.meta.env.VITE_API
const shortened = $computed(() => `${api}/s/${data.alias}`)

const copy2Clipboard = async () => {
  if (isWeb()) {
    copy(shortened)
  } else {
    await writeText(shortened)
  }

  toast.add(`Shortened link copied`, 'Info', undefined, 2)
}

const linkItemRef = $ref<HTMLButtonElement | null>(null)
onLongPress($$(linkItemRef), () => {
  copy2Clipboard()
})
</script>

<template>
  <button
    ref="linkItemRef"
    :title="shortened"
    :class="`relative p-2 ring-blue bg-[#fff] ring-1 rounded-md flex flex-col duration-100 ${
      selected ? '!ring-2' : ''
    }`"
    @click="
      !$event.ctrlKey
        ? emit('chosen', selected ? undefined : data.id)
        : open(data.url)
    "
    @dblclick="copy2Clipboard"
  >
    <template v-if="data.scrapeStatus === 'Done'">
      <div
        v-if="!!data.tag"
        class="absolute top-0 left-0 bg-blue text-white p-2 rounded-br-md rounded-tl-md text-sm shadow-md"
      >
        {{ data.tag }}
      </div>

      <div
        class="h-[100px] w-full bg-center bg-cover mb-4 rounded-md"
        :style="{ backgroundImage: `url(${data.image})` }"
      />

      <div class="px-2 border-t border-blue pt-2 w-full">
        <div class="text-blue font-medium text-left truncate">
          {{ data.title }}
        </div>

        <div :title="data.description || ''" class="truncate text-sm">
          {{ data.description }}
        </div>
      </div>
    </template>

    <template v-else-if="data.scrapeStatus === 'WIP'">
      <div class="h-[169px] w-full grid place-content-center">
        <span>
          <loading :is-loading="true" class="mr-2 relative top" />
          Crawling Data
        </span>
      </div>
    </template>

    <template v-else>
      <div class="h-[169px] w-full grid place-content-center">
        <div
          v-if="!!data.tag"
          class="absolute top-0 left-0 bg-blue text-white p-2 rounded-br-md rounded-tl-md text-sm shadow-md"
        >
          {{ data.tag }}
        </div>

        <div class="text-sm text-blue">Failed To Crawl Data</div>
        <div :title="data.url" class="truncate px-2">{{ data.url }}</div>
      </div>
    </template>
  </button>
</template>
