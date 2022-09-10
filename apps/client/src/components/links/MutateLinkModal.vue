<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { reactive, unref, watch } from 'vue'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'

import Modal from '../Modal.vue'

import { UPDATE_LINK } from '../../queries/link.js'
import { useToast } from '../../pinia/toast.js'
import {
  useCreateLink,
  CREATE_LINK_TOAST_ID,
} from '../../mutations/create-link.js'

type Props = {
  visible: boolean
  linkData?: Model.Link
}

const { visible, linkData } = defineProps<Props>()
const emit = defineEmits(['close'])

const UPDATE_LINK_TOAST_ID = 'update-link'

const toast = useToast()

const formId = 'mutate-link'
const formData = reactive<Partial<Pick<Model.Link, 'alias' | 'url'>>>({})

watch($$(linkData), (linkData) => {
  formData.alias = linkData?.alias || ''
  formData.url = linkData?.url || ''
})

watch(formData, (formData) => {
  reset(formId, unref(formData))
})

const { create, creating } = useCreateLink()

const {
  loading: updating,
  onDone: onUpdated,
  mutate: update,
  onError: onUpdateFailed,
} = useMutation(UPDATE_LINK)

onUpdateFailed(() => {
  toast.add('Link failed to update', 'Error', UPDATE_LINK_TOAST_ID, 2)
})

onUpdated(() => {
  toast.add('Link updated', 'Success', UPDATE_LINK_TOAST_ID, 2)
})

const submit = (data: any) => {
  setTimeout(() => {
    emit('close')
  }, 0)

  data.alias = data.alias || undefined

  if (linkData) {
    toast.add('Updating link', 'Working', UPDATE_LINK_TOAST_ID)
    update({ id: linkData.id, dto: data })
    return
  }

  toast.add('Creating link', 'Working', CREATE_LINK_TOAST_ID)
  create({ dto: data })
}
</script>

<template>
  <modal
    :title="`${linkData ? 'Update' : 'Create'} Link`"
    :visible="visible"
    @close="emit('close')"
    @ok="submitForm(formId)"
    class="!overflow-hidden"
    :ok-text="linkData ? 'Update' : 'Create'"
    :is-loading="creating || updating"
    id="mutate-link-modal"
  >
    <form-kit
      :config="{
        validationVisibility: 'submit',
      }"
      :id="formId"
      :actions="false"
      :is-loading="creating || updating"
      @submit="submit"
      v-model="formData"
      type="form"
    >
      <form-kit type="text" label="Url*" validation="required" name="url" />
      <form-kit type="text" label="Alias" name="alias" />
    </form-kit>
  </modal>
</template>
