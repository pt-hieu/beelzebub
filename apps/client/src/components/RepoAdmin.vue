<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { inject, type Ref } from 'vue'
import ToggleVue from './Toggle.vue'
import Confirm from './Confirm.vue'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
</script>

<template>
  <div
    class="mt-4 rounded shadow-md shadow-blue/30 p-4 grid grid-cols-[1fr,300px]"
  >
    <div></div>

    <div class="flex gap-2 flex-col">
      <div class="flex gap-2 flex-col border border-blue/50 rounded-md p-2">
        <toggle-vue
          class="grid grid-cols-[1fr,30px,1fr] text-center"
          false-label="Public"
          true-label="Private"
          :checked="repo?.repo.data.private"
        />

        <toggle-vue
          class="grid grid-cols-[1fr,30px,1fr] text-center"
          false-label="Unarchived"
          true-label="Archived"
          :checked="repo?.repo.data.archived"
        />
      </div>

      <div class="mt-3">
        <confirm message="Are you sure you want to delete this repo?" ok-text="Yes">
          <button class="button !py-2 !rounded w-full">
            <span class="fa fa-trash mr-2" />
            Delete
          </button>
        </confirm>
      </div>
    </div>
  </div>
</template>
