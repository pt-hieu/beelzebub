<script lang="ts" setup>
import type { Model } from '@black/share'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { inject, reactive, unref, watchEffect, type Ref } from 'vue'
import { pick } from 'lodash'

type ConfigDto = Pick<Model.Config, 'avatar' | 'display_name' | 'github_token'>

const emit = defineEmits(['submit'])

const FormId = 'form-config'

const config = inject<Ref<{ config: Model.Config }>>('config')
const formData = reactive({ ...unref(config)!.config })

const { mutate, loading, onDone } = useMutation<{
  input: ConfigDto
}>(
  gql`
    mutation UpdateConfig($input: UpdateConfig!) {
      updateConfig(updateData: $input) {
        id
        display_name
        avatar
        github_token
      }
    }
  `,
  () => ({
    variables: formData,
  }),
)

onDone(() => {
  emit('submit')
})

const sendData = (data: any) => {
  mutate({ input: pick(data, ['avatar', 'display_name', 'github_token']) })
}

defineExpose({
  submitConfig: () => submitForm(FormId),
  reset: () => reset(FormId, unref(formData)),
})
</script>

<template>
  <form-kit
    :id="FormId"
    @submit="sendData"
    type="form"
    :actions="false"
    v-model="formData"
    :disabled="loading"
    :config="{
      validationVisibility: 'submit',
    }"
  >
    <form-kit
      label="Display name"
      name="display_name"
      validation="required|length:0,30"
      type="text"
    />

    <form-kit label="Github Token" name="github_token" type="text" />
  </form-kit>
</template>
