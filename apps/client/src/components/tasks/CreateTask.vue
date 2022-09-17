<script lang="ts" setup>
import { reactive, unref } from 'vue'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'
import { Model } from '@beelzebub/types'
import moment from 'moment'
import { CREATE_TODO } from '@/queries/todo'

const formData = reactive({})
const formId = 'task-form'

const emit = defineEmits(['done'])

const { loading, mutate, onDone } = useMutation(CREATE_TODO)

onDone(() => {
  emit('done')
})

const submit = (data: any) => {
  const dto: Model.Todo = data
  dto.duration = Number(dto.duration)
  mutate({ input: dto })
}

defineExpose({
  submit: () => submitForm(formId),
  reset: () => reset(formId, unref(formData)),
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
  </form-kit>
</template>
