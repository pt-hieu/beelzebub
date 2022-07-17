<script lang="ts" setup>
import type { Model } from '@black/share'
import { inject, ref, type Ref } from 'vue'
import { RouterView } from 'vue-router'
import { onKeyDown } from '@vueuse/core'
import AppContainer from './AppContainer.vue'

const next = ref(false)
const config = inject<Ref<{ config: Model.Config }>>('config')

const nextBtn = ref<HTMLButtonElement | null>(null)

onKeyDown('Enter', () => {
  nextBtn.value?.click()
})
</script>

<template>
  <app-container v-if="next">
    <router-view />
  </app-container>

  <div v-motion-fade class="w-screen h-screen grid place-content-center" v-else>
    <img
      class="w-44 aspect-square rounded-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${config?.config.avatar})` }"
    />

    <div class="mt-4 text-center text-xl text-blue-shade font-medium">
      Welcome {{ config?.config.display_name }}
    </div>

    <button
      ref="nextBtn"
      @click="next = true"
      class="button w-fit mx-auto mt-6"
      autofocus
    >
      <span class="fa fa-arrow-right" />
    </button>
  </div>
</template>
