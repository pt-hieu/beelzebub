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
  <header
    class="h-[60px] bg-blue grid grid-cols-[2fr,6fr,2fr] gap-2 place-content-center text-white px-[60px]"
  >
    <div></div>
    <div class="flex justify-center gap-2 h-full">
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

    <div class="flex items-center gap-2 justify-end">
      <modal-vue
        :visible="configModal"
        @close="configModal = false"
        ok-text="Save"
        @ok="configRef?.submitConfig()"
      >
        <config ref="configRef" @submit="configModal = false" />
      </modal-vue>

      <div>Hi {{ config?.config.display_name }}. You look good!</div>

      <dropdown-vue>
        <img
          :src="config?.config.avatar"
          class="w-8 aspect-square rounded-full"
        />

        <template #overlay>
          <div
            class="min-w-[200px] rounded-md bg-blue-shade flex gap-2 flex-col py-2"
          >
            <button
              @click="configModal = true"
              class="py-2 px-3 w-full text-left hover:bg-blue"
            >
              <span class="fa fa-cog mr-2" />Settings
            </button>
          </div>
        </template>
      </dropdown-vue>
    </div>
  </header>

  <main class="px-[60px]">
    <slot></slot>
  </main>
</template>
