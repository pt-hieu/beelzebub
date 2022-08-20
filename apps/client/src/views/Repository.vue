<script lang="ts" setup>
import FooterVue from '@/components/Footer.vue'
import RepoListVue from '@/components/RepoList.vue'
import {
  GET_REPO,
  GET_REPOES,
  SYNC_REPO,
  type GetRepoesRes,
} from '@/queries/repo'
import type { Model } from '@beelzebub/types'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { provide, ref, watch } from 'vue'
import RepoViewVue from '@/components/RepoView.vue'
import { useToast } from '@/stores/toast'
import Loading from '../components/Loading.vue'

const selectedRepoId = ref<string | undefined>(undefined)

const toast = useToast()
const SYNC_REPO_TOAST_ID = 'sync-repo'

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
</script>

<template>
  <div class="grid grid-cols-[180px,1fr] py-4 h-full gap-4">
    <repo-list-vue
      @repo-selected="(id) => (selectedRepoId = id)"
      :selected-repo-id="selectedRepoId"
    />

    <repo-view-vue v-if="!!result" />
  </div>

  <footer-vue>
    <button :disabled="loading" @click="syncRepo" class="button-2nd">
      <loading class="mr-2 top-0.5" :is-loading="loading">
        <span class="fa fa-sync mr-2" />
      </loading>

      Sync
    </button>
  </footer-vue>
</template>
