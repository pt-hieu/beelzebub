<script setup lang="ts">
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { RouterView } from 'vue-router'

const config = useQuery(gql`
  query GetConfig {
    config {
      display_name
      avatar
    }
  }
`)
</script>

<template>
  {{ config.result }}
  <router-view />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
