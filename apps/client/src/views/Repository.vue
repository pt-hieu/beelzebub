<script lang="ts" setup>
import FooterVue from '@/components/Footer.vue'
import RepoListVue from '@/components/RepoList.vue'
import { GET_REPO } from '@/queries/repo'
import type { Model } from '@beelzebub/types'
import { useLazyQuery } from '@vue/apollo-composable'
import { provide, ref, watch } from 'vue'
import RepoViewVue from '../components/RepoView.vue'

const selectedRepoId = ref<string | undefined>(undefined)

const { load, result } = useLazyQuery<{
  repo: Model.GitHubRepo
}>(GET_REPO, { id: selectedRepoId.value })

watch(selectedRepoId, (id) => {
  load(GET_REPO, { id })
})

provide('repo', result)
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
    <button class="button-2nd"><span class="fa fa-sync mr-2" />Sync</button>
  </footer-vue>
</template>
