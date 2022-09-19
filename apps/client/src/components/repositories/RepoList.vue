<script lang="ts" setup>
import { GET_REPOES, type GetRepoesRes } from '@/queries/repo'
import { useQuery } from '@vue/apollo-composable'
import zIndex from '../../libs/z-index.js'
import Tooltip from '../Tooltip.vue'

const { selectedRepoId } = defineProps<{ selectedRepoId?: string }>()
const emit = defineEmits({
  repoSelected: (_id: string) => {
    return true
  },
})

const { result, onResult } = useQuery<GetRepoesRes>(GET_REPOES)
onResult(({ data: { repoes } }) => {
  emit('repoSelected', repoes[0].id)
})
</script>

<template>
  <div class="h-full overflow-hidden relative">
    <div
      class="w-[calc(100%-5px)] h-[60px] absolute top-0 left-0 gradient-mist-reversed pointer-events-none"
    />

    <div class="flex flex-col h-full overflow-auto">
      <button
        v-for="repo in result?.repoes"
        :class="[
          `px-5 py-3 text-left duration-100 flex justify-between group w-[calc(100%-4px)]`,
          selectedRepoId === repo.id &&
            `bg-blue text-white sticky top-0 bottom-0 shadow ${zIndex.SELECTED_REPOSITORY}`,
        ]"
        @click="emit('repoSelected', repo.id)"
        :key="repo.id"
      >
        <span>
          {{ repo.name.split('/')[1] }}
          <tooltip v-if="repo.outdated" text="The repo is outdated" as="span">
            <span
              :class="[
                'fa fa-warning ml-2 relative ',
                selectedRepoId === repo.id ? 'text-white' : 'text-blue',
                zIndex.OUTDATED_REPOSITORY_ICON,
              ]"
            />
          </tooltip>
        </span>

        <span
          :class="`fa fa-caret-right -translate-x-3 group-hover:translate-x-0 ${
            selectedRepoId === repo.id ? '!text-white' : 'opacity-0'
          } group-hover:opacity-100 group-hover:text-blue duration-150`"
        />
      </button>
    </div>

    <div
      class="w-[calc(100%-5px)] h-[60px] absolute bottom-0 left-0 gradient-mist pointer-events-none"
    />
  </div>
</template>

<style>
.gradient-mist {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 15%,
    rgba(255, 255, 255, 0) 100%
  );
}

.gradient-mist-reversed {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 15%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
