<script lang="ts" setup>
import Modal from './Modal.vue'
import { FormKit, submitForm, reset } from '@formkit/vue'
import { watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_REPOES, type GetRepoesRes } from '../queries/repo.js'
import { findBestMatch } from 'string-similarity'

type Props = {
  visible: boolean
}

const { visible } = defineProps<Props>()
const emit = defineEmits({
  close: () => true,
  found: (repoId: string) => !!repoId,
})
const formId = 'search-repo'
const searchField = $ref<any | null>(null)

const { result } = useQuery<GetRepoesRes>(GET_REPOES)

const repoName2Id = $computed(
  () =>
    result.value?.repoes.reduce(
      (dict, repo) => ({ ...dict, [repo.name]: repo.id }),
      {} as Record<string, string>,
    ) || {},
)

const submit = (data: any) => {
  setTimeout(() => {
    emit('close')
  }, 0)

  const q = data.search as string
  if (!q) return

  const repoNames = Object.keys(repoName2Id)
  const match = findBestMatch(q, repoNames)

  emit('found', repoName2Id[repoNames[match.bestMatchIndex]])
}

watch(
  () => visible,
  (v) => {
    if (v) {
      reset(formId, { search: '' })

      const id = searchField?.node.context.id
      const input = document.querySelector(`#${id}`) as HTMLInputElement

      setTimeout(() => {
        input?.focus?.()
      }, 0)
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <modal
    title="Search Repository"
    :visible="visible"
    @close="emit('close')"
    :ok-text="'Search'"
    @ok="submitForm(formId)"
    class="!overflow-hidden"
  >
    <form-kit
      :config="{
        validationVisibility: 'submit',
      }"
      :id="formId"
      :actions="false"
      @submit="submit"
      type="form"
    >
      <form-kit
        ref="searchField"
        type="text"
        label="Search"
        name="search"
        validation="required"
        :autocorrect="false"
        :autocomplete="false"
      />
    </form-kit>
  </modal>
</template>
