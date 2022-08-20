<script lang="ts" setup>
import type { GitHub } from '@beelzebub/types'
import Confirm from './Confirm.vue'
import { useElementHover } from '@vueuse/core'
import Motion from './Motion.vue'
import { enterFromLeft } from '@/variants/enter-from-left'

type Props = {
  data: GitHub.Collaborator
}

const { data: collab } = defineProps<Props>()

const element = $ref<HTMLDivElement>()
const isHover = $(useElementHover($$(element)))
</script>

<template>
  <div
    ref="element"
    class="grid grid-cols-[50px,1fr,50px] items-center gap-1 rounded-md px-2 ring-1 ring-blue duration-150 overflow-hidden"
  >
    <img
      :src="collab.avatar_url"
      class="rounded-full w-[40px] aspect-square my-2"
    />

    <a
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-blue"
      :href="collab.html_url"
    >
      {{ collab.login }}
    </a>

    <motion
      v-if="collab.login !== 'pt-hieu'"
      :variants="enterFromLeft"
      :flag="isHover"
      class="h-full -mr-2"
    >
      <confirm
        :message="`Are you sure you want to remove ${collab.login} from this repo?`"
        class="collab-action bg-blue grid place-content-center h-full rounded-r-md"
      >
        <button class="translate-x-2">
          <span class="fa fa-trash text-xs text-white" />
        </button>
      </confirm>
    </motion>
  </div>
</template>

<style>
.collab-action {
  clip-path: polygon(0% 100%, 60% 0%, 100% 0%, 100% 100%);
}
</style>
