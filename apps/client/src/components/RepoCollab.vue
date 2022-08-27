<script lang="ts" setup>
import { FETCH_COLLABS } from '@/queries/repo'
import type { Model } from '@beelzebub/types'
import { useMutation } from '@vue/apollo-composable'
import { inject, type Ref } from 'vue'
import Loading from './Loading.vue'
import Collaborator from './Collaborator.vue'
import { useToast } from '@/pinia/toast'

const FETCH_COLLABS_TOAST_ID = 'fetch-collab'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
const toast = useToast()

const { mutate, loading, onDone, onError } = useMutation(FETCH_COLLABS)
onDone((result) => {
  toast.add(
    `${result.data.fetchCollaborators.collabs.length} collaborators fetched!`,
    'Success',
    FETCH_COLLABS_TOAST_ID,
    2,
  )
})

onError(() => {
  toast.add('Fetch failed', 'Error', FETCH_COLLABS_TOAST_ID, 2)
})

const fetchCollaborators = () => {
  toast.add('Fetching', 'Working', FETCH_COLLABS_TOAST_ID, 2)
  mutate({ id: repo?.value?.repo.id })
}
</script>

<template>
  <div class="mb-4 flex gap-2 items-center">
    <div class="text-blue-shade font-medium text-xl">Collaborators</div>

    <button :disabled="loading" @click="fetchCollaborators" class="button-3rd">
      <loading class="mr-2 top-0.5" :is-loading="loading">
        <span class="fa fa-sync mr-2" />
      </loading>

      Fetch
    </button>
  </div>

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
</template>
