<script setup lang="ts">
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import type { Model } from '@beelzebub/types'
import { provide } from 'vue'
import WelcomeVue from './components/Welcome.vue'
import DarkModeHandler from './components/DarkModeHandler.vue'

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
  <dark-mode-handler />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Baloo 2', sans-serif;
}

.fa {
  @apply translate-y-[1px] text-sm;
}

.danger-2nd {
  @apply !text-red-600 !border-red-600 !shadow-red-200;
}

.button-base {
  @apply px-5 py-3 rounded-lg duration-100 border border-blue hover:border-blue-tint text-sm hover:shadow-md shadow-blue;
  @apply dark:border-cyan dark:hover:border-cyan-tint dark:shadow-cyan/40;
}

.button {
  @apply bg-blue hover:bg-blue-tint text-white button-base disabled:!bg-gray disabled:!shadow-none disabled:!border-gray;
  @apply dark:bg-$blue dark:hover:bg-$blue-tint dark:text-cyan;
}

.button-2nd {
  @apply text-blue hover:text-blue-tint button-base disabled:!text-gray disabled:!border-gray disabled:!shadow-none;
}

.button-3rd {
  @apply button-2nd border-none;
}
</style>

<style>
/* Scroll bar stylings */
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #5a7bb5;
  border-radius: 2px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #7c95a4;
}
</style>

<style>
.lds-ring {
  display: inline-block;
  position: relative;
  width: 14px;
  height: 14px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 12px;
  height: 12px;
  margin: 2px;
  border: 2px solid #5a7bb5;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #5a7bb5 transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
