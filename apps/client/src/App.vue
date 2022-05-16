<script setup lang="ts">
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { RouterView } from 'vue-router'
import type { Model } from '@black/share'
import { provide } from 'vue'
import AppContainer from './components/AppContainer.vue'

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
  <app-container v-if="!loading">
    <router-view />
  </app-container>
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
