<script setup lang="ts">
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { RouterView } from 'vue-router'
import type { Model } from '@black/share'

const { result } = useQuery<{ config: Model.Config }>(gql`
  query GetConfig {
    config {
      display_name
      avatar
    }
  }
`)
</script>

<template>
  {{ result?.config.display_name }}
  <router-view />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
