<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import moment from 'moment'
import { computed, inject, type Ref } from 'vue'
import { open } from '@tauri-apps/api/dialog'
import { Command, Child, open as openFile } from '@tauri-apps/api/shell'
import { useMutation } from '@vue/apollo-composable'
import { removeDir } from '@tauri-apps/api/fs'

import RepoAdminVue from '../repositories/RepoAdmin.vue'
import Tag from '../Tag.vue'
import ExtendButton from '../ExtendButton.vue'
import Confirm from '../Confirm.vue'
import SetRepoPath from '../repositories/SetRepoPath.vue'

import { isWeb } from '../../libs/platform'
import { useToast } from '../../pinia/toast.js'
import { useOnPiniaEvent } from '../../composables/useOnPiniaEvent.js'
import { UDPATE_REPO } from '../../queries/repo.js'

const CLONING_REPO_TOAST_ID = 'cloning-repo'
const UPDATE_PATH_TOAST_ID = 'update-path'

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
const toast = useToast()

const createDate = computed(() => moment(repo?.value?.repo.data.created_at))
const syncDate = computed(() => moment(repo?.value?.repo.synced_at))

let child = $ref<Child>()
let dirPath = $ref<string | undefined>()

let setPathModalVisible = $ref(false)

const { mutate, onDone } = useMutation(UDPATE_REPO)

onDone(() => {
  toast.add('Path is well configured', 'Info', UPDATE_PATH_TOAST_ID, 2)
})

const cloneRepo = async () => {
  if (isWeb()) return

  dirPath = undefined
  dirPath = (await open({
    multiple: false,
    directory: true,
    title: `Choose a folder for ${repo?.value?.repo.name} to be resided`,
  })) as string

  if (repo?.value?.repo.data.git_url && dirPath) {
    const cmd = new Command('git', ['clone', repo.value.repo.data.html_url], {
      cwd: dirPath,
    })

    cmd.on('close', () => {
      toast.add(
        `${repo.value?.repo.name} has been cloned!`,
        'Success',
        CLONING_REPO_TOAST_ID,
        2,
      )

      toast.add('Updating path property', 'Working', UPDATE_PATH_TOAST_ID)
      mutate({
        id: repo.value?.repo.id || '',
        dto: {
          path: `${dirPath}/${repo.value?.repo.data.name}`,
        },
      })
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

    toast.add('Repo is cleaned up', 'Info', undefined, 2)
  }
})

const openRepoInExplorer = async () => {
  if (repo?.value?.repo.path) {
    await openFile(repo.value.repo.path)
    return
  }

  toast.add('Path has not been configured', 'Error', undefined, 2)
}

const OPEN_VSCODE_TOAST_ID = 'open vscode'
const openInVsCode = async () => {
  if (isWeb()) return

  const path = repo?.value?.repo.path
  if (!path) {
    toast.add('Path has not been configured', 'Error', undefined, 2)
    return
  }

  const cmd = new Command('code', path)
  cmd.on('error', () => {
    toast.add('Open repo in Vs Code failed!', 'Error', OPEN_VSCODE_TOAST_ID, 2)
  })

  await cmd.spawn().catch((e) => {
    alert(e)
  })
}
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

        <extend-button
          class="button-2nd"
          @open-folder="openRepoInExplorer"
          @click="openInVsCode"
          :button-disabled="isWeb() || !repo?.repo.path"
          :extensions="[
            {
              label: 'Open Folder',
              icon: 'fa fa-folder',
              event: 'open-folder',
              disabled: isWeb() || !repo?.repo.path,
            },
            {
              label: 'Open in GitHub',
              link: repo?.repo.data.html_url || '',
              icon: 'fab fa-github',
              disabled: repo?.repo.outdated,
            },
            {
              label: 'Edit in GitHub',
              link: `https://github.dev/${repo?.repo.name}`,
              icon: 'fa fa-edit',
              disabled: repo?.repo.outdated,
            },
          ]"
        >
          <span class="fa fa-code mr-2" />Open In VS Code</extend-button
        >
      </div>

      <div class="text-sm">
        Created {{ createDate.fromNow() }} ({{
          createDate.format('ddd DD/MM/yyyy')
        }})
      </div>

      <div class="text-sm">Synced {{ syncDate.fromNow() }}</div>

      <div class="mt-4 flex gap-2">
        <confirm
          :ok-text="'Yes'"
          message="It looks like you have already cloned this repo! Do you still want to clone it, again?"
          :disabled-modal="!repo?.repo.path"
          @ok="cloneRepo"
        >
          <button :disabled="isWeb() || repo?.repo.outdated" class="button">
            <span class="fa fa-copy mr-2" />
            Clone this repo
          </button>
        </confirm>

        <button @click="setPathModalVisible = true" class="button-2nd">
          <span class="fa fa-wrench mr-2" />
          {{ repo?.repo.path ? 'Update' : 'Set' }} Local Path
        </button>
      </div>
    </div>

    <repo-admin-vue v-if="repo?.repo.data.permissions.admin" />

    <set-repo-path
      :visible="setPathModalVisible"
      @close="setPathModalVisible = false"
      :path="repo?.repo.path || ''"
    />
  </div>
</template>
