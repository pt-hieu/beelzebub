<script lang="ts" setup>
import type { Model } from '@beelzebub/types'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { inject, reactive, unref, watch, type Ref } from 'vue'
import { pick } from 'lodash'
import SwitchVue from './Switch.vue'
import {
  canRestoreDarkMode,
  disableDarkMode,
  enableDarkMode,
  saveDarkModePref,
} from '../libs/darkmode.js'

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

let darkMode = $ref(await canRestoreDarkMode())
watch($$(darkMode), (enable) => {
  saveDarkModePref(!enable)

  if (enable) {
    enableDarkMode()
  }

  if (!enable) {
    disableDarkMode()
  }
})
</script>

<template>
  <div>
    <div
      class="flex items-center gap-2 p-4 border border-blue rounded-md mb-4 mt-2"
    >
      <switch-vue
        :initial-checked="darkMode"
        :checked="darkMode"
        @change="(v) => (darkMode = v)"
      >
        <template #default="{ toggle }">
          <label @click="toggle">Dark Mode</label>
        </template>
      </switch-vue>
    </div>

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

      <form-kit
        label="Avatar"
        name="avatar"
        validation="required"
        type="text"
      />
      <form-kit label="Github Token" name="github_token" type="text" />
    </form-kit>
  </div>
</template>
