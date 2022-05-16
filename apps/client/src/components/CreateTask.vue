<script lang="ts" setup>
import { reactive, unref } from 'vue'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { useMutation } from '@vue/apollo-composable'
import { Model } from '@black/share'
import moment from 'moment'
import { GET_TODOES, CREATE_TODO, type GetTodoesRes } from '@/queries/todo'

const formData = reactive({})
const formId = 'task-form'

const emit = defineEmits(['done'])

const { loading, mutate, onDone } = useMutation(CREATE_TODO, {
  update: (cache, { data: { createTodo } }) => {
    let data = cache.readQuery<GetTodoesRes>({ query: GET_TODOES })
    data = {
      todoes: [createTodo, ...(data?.todoes || [])],
    }

    cache.writeQuery({ query: GET_TODOES, data })
  },
})

onDone(() => {
  emit('done')
})

const submit = (data: any) => {
  const dto: Model.Todo = data
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
    <form-kit label="Title" name="title" validation="length:0,30" type="text" />

    <form-kit
      label="Content"
      name="content"
      validation="required|length:0,120"
      type="textarea"
    />

    <form-kit
      label="Categorization"
      name="categorization"
      validation="required"
      type="checkbox"
      :options="Object.values(Model.TodoCategorization)"
    />

    <form-kit
      label="Deadline"
      name="deadline"
      :validation="`after:${moment().format('YYYY-MM-DD')}`"
      type="date"
    />
  </form-kit>
</template>
