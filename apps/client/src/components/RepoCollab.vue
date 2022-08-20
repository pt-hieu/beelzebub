<script lang="ts" setup>
import { FETCH_COLLABS } from '@/queries/repo'
import type { Model } from '@beelzebub/types'
import { useMutation } from '@vue/apollo-composable'
import { inject, type Ref } from 'vue'
import Confirm from './Confirm.vue'
import Loading from './Loading.vue'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
const { mutate, loading } = useMutation(FETCH_COLLABS)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="user in repo?.repo.collabs"
      :key="user.id"
      class="grid grid-cols-[50px,1fr,50px] items-center gap-4"
    >
      <img :src="user.avatar_url" class="rounded-full w-[40px] aspect-square" />

      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-blue"
          :href="user.html_url"
        >
          {{ user.login }}
        </a>
      </div>

      <div>
        <confirm
          :message="`Are you sure you want to remove ${user.login} from ${repo?.repo.name}`"
        >
          <button v-if="user.login !== 'pt-hieu'">
            <span class="fa fa-trash text-xs text-blue" />
          </button>
        </confirm>
      </div>
    </div>

    <div
      v-if="!repo?.repo.collabs.length"
      class="w-full text-center text-blue/50 py-5"
    >
      Collaborator list has not been fetched
    </div>
  </div>

  <div class="mt-4">
    <button @click="mutate({ id: repo?.repo.id })" class="button-2nd">
      <loading class="mr-2 top-0.5" :is-loading="loading">
        <span class="fa fa-sync mr-2" />
      </loading>

      Fetch collaborators
    </button>
  </div>
</template>
