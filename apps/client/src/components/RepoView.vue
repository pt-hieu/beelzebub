<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { computed, inject, type Ref } from 'vue'
import RepoAdminVue from './RepoAdmin.vue'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')

const createDate = computed(() => moment(repo?.value?.repo.data.created_at))
</script>

<template>
  <div class="pl-6">
    <div>
      <div class="flex justify-between items-center">
        <span class="text-xl">
          {{ repo?.repo?.name }}
          <span class="text-blue">Panel</span>
        </span>

        <span class="flex gap-2 text-xs">
          <a
            target="_blank"
            rel="noopener noreferrer"
            :href="`https://github.dev/${repo?.repo.name}`"
          >
            <button class="button-2nd px-2 py-0 -translate-y-0.5">
              <span class="fa fa-edit" />
            </button>
          </a>

          <a
            target="_blank"
            rel="noopener noreferrer"
            :href="repo?.repo?.data.html_url"
          >
            <button class="button-2nd px-2 py-0 -translate-y-0.5">
              <span class="fa fa-external-link" />
            </button>
          </a>
        </span>
      </div>

      <span class="text-sm"
        >Created {{ createDate.fromNow() }} ({{
          createDate.format('ddd DD/MM/yyyy')
        }})</span
      >
    </div>

    <repo-admin-vue v-show="repo?.repo.data.permissions.admin" />
  </div>
</template>
