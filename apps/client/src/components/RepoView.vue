<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { computed, inject, type Ref } from 'vue'
import RepoAdminVue from './RepoAdmin.vue'
import { open } from '@tauri-apps/api/dialog'
import { Command, Child } from '@tauri-apps/api/shell'
import { removeDir } from '@tauri-apps/api/fs'
import Tag from './Tag.vue'
import { isWeb } from '../libs/platform'
import { useToast } from '../pinia/toast.js'
import { useOnPiniaEvent } from '../composables/useOnPiniaEvent.js'

const CLONING_REPO_TOAST_ID = 'cloning-repo'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
const toast = useToast()

const createDate = computed(() => moment(repo?.value?.repo.data.created_at))
const syncDate = computed(() => moment(repo?.value?.repo.synced_at))

let child = $ref<Child>()
let dirPath = $ref<string | undefined>()

const cloneRepo = async () => {
  if (isWeb()) return

  dirPath = undefined
  dirPath = (await open({
    multiple: false,
    directory: true,
    title: `Choose a folder for ${repo?.value?.repo.name} to be resided`,
  })) as string

  if (repo?.value?.repo.data.git_url && dirPath) {
    const cmd = new Command(
      'clone repo',
      ['clone', repo.value.repo.data.html_url],
      { cwd: dirPath },
    )

    cmd.on('close', () => {
      toast.add(
        `${repo.value?.repo.name} has been cloned!`,
        'Success',
        CLONING_REPO_TOAST_ID,
        2,
      )
    })

    cmd.on('error', () => {
      toast.add(
        `Cloning ${repo.value?.repo.name} has failed!`,
        'Error',
        CLONING_REPO_TOAST_ID,
        2,
      )
    })

    toast.add(
      `Cloning ${repo.value.repo.name}`,
      'Working',
      CLONING_REPO_TOAST_ID,
      undefined,
      [{ event: 'abort-cloning', label: 'Abort', icon: 'fa fa-stop' }],
    )

    child = await cmd.spawn()
  }
}

useOnPiniaEvent('abort-cloning', async () => {
  await child.kill()

  toast.add(
    `Cloning ${repo?.value?.repo.name} has been aborted!`,
    'Info',
    CLONING_REPO_TOAST_ID,
    2,
  )

  if (dirPath) {
    await removeDir(`${dirPath}/${repo?.value?.repo.data.name}`, {
      recursive: true,
    })

    toast.add('Done cleaning up clone mess', 'Info', undefined, 2)
  }
})
</script>

<template>
  <div class="pl-6">
    <div>
      <div class="flex justify-between items-center">
        <span class="text-xl">
          {{ repo?.repo?.name }}
          <span class="text-blue">Panel</span>

          <tag v-if="repo?.repo.outdated" class="ml-2">Outdated</tag>
          <tag v-else class="ml-2">Up to date</tag>
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

      <div class="text-sm">
        Created {{ createDate.fromNow() }} ({{
          createDate.format('ddd DD/MM/yyyy')
        }})
      </div>

      <div class="text-sm">Synced {{ syncDate.fromNow() }}</div>

      <div class="mt-4">
        <button :disabled="isWeb()" @click="cloneRepo" class="button">
          <span class="fa fa-copy mr-2" />
          Clone this repo
        </button>
      </div>
    </div>

    <repo-admin-vue v-if="repo?.repo.data.permissions.admin" />
  </div>
</template>
