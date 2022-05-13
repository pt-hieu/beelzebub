<script setup lang="ts">
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { RouterView } from 'vue-router'
import type { Model } from '@black/share'
import { provide } from 'vue'
import AppContainer from './components/AppContainer.vue'

const { result } = useQuery<{ config: Model.Config }>(gql`
  query GetConfig {
    config {
      display_name
      avatar
    }
  }
`)

provide('config', result)
</script>

<template>
  <app-container>
    <router-view />
  </app-container>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
