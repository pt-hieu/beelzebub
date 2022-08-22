<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { inject, reactive, ref, watch, watchEffect, type Ref } from 'vue'
import ToggleVue from './Toggle.vue'
import Confirm from './Confirm.vue'
import RepoCollab from './RepoCollab.vue'
import { useMutation } from '@vue/apollo-composable'
import { UDPATE_REPO } from '@/queries/repo'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')

const apiBlock = ref(false)
const payload = reactive({
  private: false,
  archived: false,
  is_template: false,
})

watch(
  repo!,
  (repo, oldRepo) => {
    apiBlock.value = repo?.repo.name !== oldRepo?.repo.name
  },
  { flush: 'pre' },
)

watchEffect(
  () => {
    payload.archived = repo?.value?.repo.data.archived || false
    payload.private = repo?.value?.repo.data.private || false
    payload.is_template = repo?.value?.repo.data.is_template || false
  },
  { flush: 'post' },
)

const { loading, mutate: updateRepo } = useMutation(UDPATE_REPO)
watch(payload, ({ archived, is_template, private: isPrivate }) => {
  if (apiBlock.value) {
    apiBlock.value = false
    return
  }

  let dto: any = {}

  if (isPrivate !== repo?.value?.repo.data.private) {
    dto.private = isPrivate
  }

  if (archived !== repo?.value?.repo.data.archived) {
    dto.archived = archived
  }

  if (is_template !== repo?.value?.repo.data.is_template) {
    dto.is_template = is_template
  }

  if (Object.values(dto).length) {
    updateRepo({
      id: repo?.value?.repo.id,
      dto,
    })
  }
})
</script>

<template>
  <div class="mt-10 grid grid-cols-[1fr,250px] gap-8">
    <div>
      <repo-collab />
    </div>

    <div class="flex gap-2 flex-col">
      <div class="flex gap-2 flex-col border border-blue/50 rounded-md p-2">
        <toggle-vue
          class="grid grid-cols-[1fr,30px,1fr] text-center"
          false-label="Public"
          true-label="Private"
          :checked="payload.private"
          :disabled="loading || payload.archived"
          @change="(value) => (payload.private = value)"
        />

        <toggle-vue
          class="grid grid-cols-[1fr,30px,1fr] text-center"
          false-label="Unarchived"
          true-label="Archived"
          :checked="payload.archived"
          :disabled="loading || payload.archived"
          @change="(value) => (payload.archived = value)"
        />

        <toggle-vue
          class="grid grid-cols-[1fr,30px,1fr] text-center"
          false-label="Code"
          true-label="Template"
          :checked="payload.is_template"
          :disabled="loading || payload.archived"
          @change="(value) => (payload.is_template = value)"
        />
      </div>

      <div class="!text-xs">
        <span class="fa fa-info text-blue mr-2" />
        You cannot
        <a
          target="_blank"
          rel="noopener noreferrer"
          :href="`https://github.com/${repo?.repo.name}/settings`"
          class="text-blue"
          >unarchive</a
        >
        the repo from here
      </div>

      <div class="mt-3">
        <confirm
          message="Are you sure you want to delete this repo?"
          ok-text="Yes"
        >
          <button class="button !py-2 !rounded w-full">
            <span class="fa fa-trash mr-2" />
            Delete
          </button>
        </confirm>
      </div>
    </div>
  </div>
</template>
