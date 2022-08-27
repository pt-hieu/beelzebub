<script lang="ts" setup>
import { inject, reactive, unref, watch, type Ref } from 'vue'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'
import { UDPATE_REPO } from '../queries/repo.js'
import type { Model } from '@beelzebub/types'
import { open } from '@tauri-apps/api/dialog'
import Modal from './Modal.vue'
import { useToast } from '../pinia/toast.js'

type Props = {
  visible: boolean
  path?: string
}

const repo = inject<Ref<{ repo: Model.GitHubRepo } | undefined>>('repo')
const toast = useToast()

const { visible, path } = defineProps<Props>()
const emit = defineEmits(['close'])

const formId = 'update-path'
const formData = reactive({ path })

const { loading, onDone, mutate } = useMutation(UDPATE_REPO)

const submit = (data: any) => {
  mutate({
    id: repo?.value?.repo.id,
    dto: {
      path: data.path,
    },
  })
}

watch(
  () => path,
  (path) => {
    if (typeof path !== 'string') return
    formData.path = path
  },
)

onDone(() => {
  emit('close')
  toast.add('Local path updated', 'Info', undefined, 2)
})

const browse = async () => {
  const dir = (await open({
    directory: true,
    multiple: false,
    title: 'Choose where the clone reside',
  })) as string

  formData.path = dir
}

watch(formData, () => {
  reset(formId, unref(formData))
})
</script>

<template>
  <modal
    :title="`${path ? 'Update' : 'Set'} Local Path`"
    :visible="visible"
    @close="emit('close')"
    :is-loading="loading"
    @ok="submitForm(formId)"
    class="!overflow-hidden"
    :ok-text="'Save'"
  >
    <form-kit
      :config="{
        validationVisibility: 'submit',
      }"
      :id="formId"
      :actions="false"
      :disabled="loading"
      @submit="submit"
      v-model="formData"
      type="form"
    >
      <div class="grid grid-cols-[1fr,60px] gap-2 items-center">
        <form-kit type="text" value="asdasdasd" label="Path" name="path" />

        <button
          @click="browse"
          type="button"
          class="button-2nd h-fit w-fit translate-y-1.5 !py-[10px]"
        >
          <span class="fa fa-folder" />
        </button>
      </div>
    </form-kit>
  </modal>
</template>
