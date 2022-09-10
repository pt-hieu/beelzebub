<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { provide, ref, watch } from 'vue'

import RepoViewVue from '@/components/repositories/RepoView.vue'
import { useToast } from '@/pinia/toast'
import FooterVue from '@/components/Footer.vue'
import { useOnSseEvent } from '@/composables/useOnSseEvent'
import RepoListVue from '@/components/repositories/RepoList.vue'
import {
  GET_REPO,
  GET_REPOES,
  SYNC_REPO,
  type GetRepoesRes,
} from '@/queries/repo'

import Loading from '../components/Loading.vue'
import CreateRepo from '../components/repositories/CreateRepo.vue'
import SearchRepoModal from '../components/repositories/SearchRepoModal.vue'

const selectedRepoId = ref<string | undefined>(undefined)

const toast = useToast()

const SYNC_REPO_TOAST_ID = 'sync-repo'
const SYNC_REPO_REPORT_TOAST_ID = 'sync-repo-report'

const { load, result } = useLazyQuery<{
  repo: Model.GitHubRepo
}>(GET_REPO, { id: selectedRepoId.value })

watch(selectedRepoId, (id) => {
  load(GET_REPO, { id })
})

provide('repo', result)

const { mutate, loading, onDone, onError } = useMutation<{
  syncRepo: Model.Repo[]
}>(SYNC_REPO, {
  update(cache, { data }) {
    let repoes = cache.readQuery<GetRepoesRes>({ query: GET_REPOES })
    const repoArray = [
      ...(repoes?.repoes || []).map((repo) => [repo.id, repo] as const),
      ...(data?.syncRepo || []).map((repo) => [repo.id, repo] as const),
    ]

    repoes = {
      repoes: Array.from(new Map<string, Model.Repo>(repoArray).values()),
    }

    cache.writeQuery<GetRepoesRes>({ query: GET_REPOES, data: repoes })
  },
})

const syncRepo = () => {
  toast.add(
    `Start syncing repositories from GitHub!`,
    'Info',
    SYNC_REPO_TOAST_ID,
    2,
  )

  mutate()
}

onDone((result) => {
  toast.add(
    `${result.data?.syncRepo.length} repositories synced!`,
    'Success',
    SYNC_REPO_TOAST_ID,
    2,
  )
})

onError(() => {
  toast.add(`Synced failed!`, 'Error', SYNC_REPO_TOAST_ID, 2)
})

useOnSseEvent('repo.synced.1', (pl) => {
  toast.add(
    `Post sync event completed, found ${pl.count} outdated repositories!`,
    'Info',
    SYNC_REPO_REPORT_TOAST_ID,
    2,
  )
})

const createRepoVisible = $ref(false)
const searchRepoVisible = $ref(false)
</script>

<template>
  <div class="grid grid-cols-[300px,1fr] py-4 h-full gap-4">
    <repo-list-vue
      @repo-selected="(id) => (selectedRepoId = id)"
      :selected-repo-id="selectedRepoId"
    />

    <repo-view-vue v-if="!!result" />
  </div>

  <create-repo
    :visible="createRepoVisible"
    @close="createRepoVisible = false"
  />

  <search-repo-modal
    :visible="searchRepoVisible"
    @close="searchRepoVisible = false"
    @found="(repoId) => (selectedRepoId = repoId)"
  />

  <footer-vue>
    <button @click="searchRepoVisible = true" class="button-2nd">
      <span class="fa fa-search mr-2" />
      Search
    </button>

    <button @click="createRepoVisible = true" class="button-2nd">
      <span class="fa fa-plus mr-2" />
      Add New
    </button>

    <button :disabled="loading" @click="syncRepo" class="button-2nd">
      <loading class="mr-2 top-0.5" :is-loading="loading">
        <span class="fa fa-sync mr-2" />
      </loading>

      Sync All From GitHub
    </button>
  </footer-vue>
</template>
