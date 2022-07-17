<script setup lang="ts">
import type { Model } from '@black/share'
import { inject, ref, watch, type Ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import DropdownVue from './Dropdown.vue'
import { routes } from '../router'
import Config from './Config.vue'
import ModalVue from './Modal.vue'

const { currentRoute } = useRouter()
const config = inject<Ref<{ config: Model.Config }>>('config')

const configModal = ref(false)
const configRef = ref<InstanceType<typeof Config> | null>(null)

watch(configModal, () => {
  if (!configModal.value) return
  configRef.value?.reset()
})
</script>

<template>
  <div v-motion-fade>
    <header
      class="h-[60px] grid grid-cols-[2fr,6fr,2fr] gap-2 place-content-center px-[60px] border-b border-blue/20"
    >
      <div id="reserved" />

      <div class="flex justify-center gap-2 h-full">
        <router-link
          v-for="route in routes"
          :class="`py-2 px-4 hover:bg-blue-tint/40 hover:text-white text-blue ${
            currentRoute.path === route.path ? `!bg-blue-tint !text-white` : ``
          } rounded-md duration-100 ease-in-out`"
          :to="route.path"
          :key="route.path"
        >
          <span v-if="route.name !== 'Home'">{{route.name}}</span>
          <span v-else class="fa fa-home" />
        </router-link>
      </div>

      <div class="flex items-center gap-2 justify-end">
        <modal-vue
          :visible="configModal"
          @close="configModal = false"
          ok-text="Save"
          @ok="configRef?.submitConfig()"
        >
          <config ref="configRef" @submit="configModal = false" />
        </modal-vue>

        <div class="text-blue">
          Hi {{ config?.config.display_name }}. You look good!
        </div>

        <dropdown-vue>
          <img
            :src="config?.config.avatar"
            class="w-8 aspect-square rounded-full translate-y-1"
          />

          <template #overlay>
            <div
              class="min-w-[200px] rounded-md bg-white border border-blue/30 flex gap-2 flex-col py-2 text-blue shadow"
            >
              <button
                @click="configModal = true"
                class="py-2 px-3 w-full text-left hover:bg-blue hover:text-white duration-100"
              >
                <span class="fa fa-cog mr-2" />Settings
              </button>
            </div>
          </template>
        </dropdown-vue>
      </div>
    </header>

    <main
      class="px-[60px] pb-[80px] h-[clamp(0px,calc(100vh-140px),calc(100vh-140px))]"
    >
      <slot></slot>
    </main>
  </div>
</template>
