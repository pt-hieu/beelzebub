<script lang="ts" setup>
import { reactive, unref } from 'vue'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'
import { Model } from '@beelzebub/types'
import moment from 'moment'
import { CREATE_TODO } from '@/queries/todo'
import SwitchVue from '../Switch.vue'

const formData = reactive({})
const formId = 'task-form'

const emit = defineEmits(['done'])

const { loading, mutate, onDone } = useMutation(CREATE_TODO)
let weekly = $ref(false)

onDone(() => {
  emit('done')
})

const submit = (data: any) => {
  const dto: Model.Todo = data

  dto.duration = Number(dto.duration)
  dto.weekly = weekly
  dto.remind = Model.RemindType.FIVE_MINUTES_BEFORE

  mutate({ input: dto })
}

defineExpose({
  submit: () => submitForm(formId),
  reset: () => {
    reset(formId, unref(formData))
    weekly = false
  },
})
</script>

<template>
  <form-kit
    :id="formId"
    @submit="submit"
    :actions="false"
    :disabled="loading"
    v-model="formData"
    :config="{
      validationVisibility: 'submit',
    }"
    type="form"
  >
    <form-kit
      label="Title*"
      name="title"
      validation="length:0,30"
      type="text"
    />

    <form-kit
      label="Content*"
      name="content"
      validation="required|length:0,500"
      type="textarea"
    />

    <form-kit
      label="Categorization*"
      name="categorization"
      validation="required"
      type="checkbox"
      :options="Object.values(Model.TodoCategorization)"
    />

    <div class="grid grid-cols-2 gap-2">
      <form-kit
        type="number"
        label="Duration"
        help="In minutes"
        name="duration"
        :min="0"
        :step="15"
      />

      <form-kit
        label="Start Time*"
        name="startTime"
        :validation="`after:${moment().format('YYYY-MM-DD')}`"
        type="datetime-local"
      />
    </div>

    <div class="flex items-center gap-2">
      <switch-vue :checked="weekly" @change="(v) => (weekly = v)">
        <template #default="{ toggle }">
          <label class="dark:text-white/80" @click="toggle">Weekly</label>
        </template>
      </switch-vue>
    </div>
  </form-kit>
</template>
