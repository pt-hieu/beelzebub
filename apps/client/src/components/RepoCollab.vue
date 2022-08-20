<script lang="ts" setup>
import { FETCH_COLLABS } from '@/queries/repo'
import type { Model } from '@beelzebub/types'
import { useMutation } from '@vue/apollo-composable'
import { inject, type Ref } from 'vue'
import Confirm from './Confirm.vue'
import Loading from './Loading.vue'
import Collaborator from './Collaborator.vue'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
const { mutate, loading } = useMutation(FETCH_COLLABS)
</script>

<template>
  <div
    v-if="!repo?.repo.collabs.length"
    class="w-full text-center text-blue/50 py-5"
  >
    Collaborator list has not been fetched
  </div>

  <div
    v-else
    class="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-3"
  >
    <collaborator
      v-for="user in repo?.repo.collabs"
      :key="user.id"
      :data="user"
    />
  </div>

  <div class="mt-4">
    <button
      :disabled="loading"
      @click="mutate({ id: repo?.repo.id })"
      class="button-3rd"
    >
      <loading class="mr-2 top-0.5" :is-loading="loading">
        <span class="fa fa-sync mr-2" />
      </loading>

      Fetch collaborators
    </button>
  </div>
</template>
