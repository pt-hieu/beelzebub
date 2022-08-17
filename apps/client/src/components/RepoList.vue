<script lang="ts" setup>
import { GET_REPOES, type GetRepoesRes } from '@/queries/repo'
import { useQuery } from '@vue/apollo-composable'

const props = defineProps<{ selectedRepoId?: string }>()
const emit = defineEmits({
  repoSelected: (_id: string) => {
    return true
  },
})

const { result } = useQuery<GetRepoesRes>(GET_REPOES)
</script>

<template>
  <div class="flex flex-col gap-2 h-full overflow-auto pr-2 -mr-2">
    <button
      v-for="repo in result?.repoes"
      :class="`border rounded-md border-blue-tint px-5 py-3 ${
        props.selectedRepoId === repo.id ? 'bg-blue text-white' : ''
      }`"
      @click="emit('repoSelected', repo.id)"
      :key="repo.id"
    >
      {{ repo.name.split('/')[1] }}
    </button>
  </div>
</template>
