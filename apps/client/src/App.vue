<script setup lang="ts">
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import type { Model } from '@black/share'
import { provide } from 'vue'
import WelcomeVue from './components/Welcome.vue'

const { result, loading } = useQuery<{ config: Model.Config }>(gql`
  query GetConfig {
    config {
      id
      display_name
      github_token
      avatar
    }
  }
`)

provide('config', result)
</script>

<template>
  <welcome-vue v-if="!loading" />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Baloo 2', sans-serif;
}

.fa {
  @apply translate-y-[1px];
}

.danger-2nd {
  @apply !text-red-600 !border-red-600 !shadow-red-200
}

.button-base {
  @apply px-5 py-3 rounded-xl duration-100 border border-blue hover:border-blue-tint text-sm hover:shadow-md shadow-blue;
}

.button {
  @apply bg-blue hover:bg-blue-tint text-white button-base;
}

.button-2nd {
  @apply text-blue hover:text-blue-tint  button-base;
}

.button-3rd {
  @apply button-2nd border-none;
}
</style>
