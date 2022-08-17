<script lang="ts" setup>
import { GET_REPOES, type GetRepoesRes } from '@/queries/repo'
import { useQuery } from '@vue/apollo-composable'
import FooterVue from '@/components/Footer.vue'

const { result } = useQuery<GetRepoesRes>(GET_REPOES)
</script>

<template>
  {{ JSON.stringify(result?.repoes) }}

  <footer-vue>
    <button class="button-2nd"><span class="fa fa-sync mr-2" />Sync</button>
  </footer-vue>
</template>
