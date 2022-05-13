<script setup lang="ts">
import type { Model } from '@black/share'
import { inject, type Ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { routes } from '../router'

const config = inject<Ref<{ config: Model.Config }>>('config')
const { currentRoute } = useRouter()
</script>

<template>
  <header
    class="h-[100px] bg-blue grid grid-rows-[6fr,4fr] gap-2 place-content-center text-white"
  >
    <div class="grid place-content-center">Hi {{ config?.config.display_name }}. You look good!</div>

    <div class="flex justify-center gap-2 h-full pb-2">
      <router-link
        v-for="route in routes"
        :class="`py-2 px-4 hover:bg-blue-tint/40 ${
          currentRoute.path === route.path ? `!bg-blue-tint` : ``
        } rounded-md duration-100 ease-in-out`"
        :to="route.path"
        :key="route.path"
      >
        {{ route.name }}
      </router-link>
    </div>
  </header>

  <main class="bg-gray">
    <slot></slot>
  </main>
</template>
