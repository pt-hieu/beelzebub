<script lang="ts" setup>
import { FormKit, submitForm, reset } from '@formkit/vue'
import { reactive } from 'vue'
import { useMutation } from '@vue/apollo-composable'

import { CREATE_REPO, GET_REPOES, type GetRepoesRes } from '@/queries/repo'

import Modal from '../Modal.vue'

type Props = {
  visible: boolean
}

const formId = 'repo-form'

const { visible } = defineProps<Props>()
const emit = defineEmits(['close'])

const { loading, mutate, onDone } = useMutation(CREATE_REPO, {
  update: (cache, { data: { createRepo } }) => {
    let data = cache.readQuery<GetRepoesRes>({ query: GET_REPOES })

    data = {
      repoes: [createRepo, ...(data?.repoes || [])],
    }

    cache.writeQuery({ query: GET_REPOES, data })
  },
})

onDone(() => {
  emit('close')
  reset(formId, { name: '' })
})

const formData = reactive({ name: '' })
const submit = (data: any) => {
  mutate({ dto: data })
}
</script>

<template>
  <modal
    title="Create A New Repository"
    :visible="visible"
    @close="emit('close')"
    :is-loading="loading"
    @ok="submitForm(formId)"
    class="!overflow-hidden"
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
      <form-kit label="Name" name="name" validation="length:0,30" type="text" />

      <div class="text-xs">
        <span class="fa fa-info mr-2" />

        As default, newly created repoes will be
        <span class="text-blue">private</span>
      </div>
    </form-kit>
  </modal>
</template>
