<script setup lang="ts">
import type { Model } from '@beelzebub/types'
import { inject, ref, watch, type Ref } from 'vue'
import { appWindow } from '@tauri-apps/api/window'
import { useRouter, RouterLink } from 'vue-router'
import DropdownVue from './Dropdown.vue'
import { routes } from '../router'
import Config from './Config.vue'
import ModalVue from './Modal.vue'
import ToastHandler from './ToastHandler.vue'
import SubscriptionHandler from './SubscriptionHandler.vue'
import { isTauri } from '../libs/platform.js'
import Confirm from './Confirm.vue'
import ShortcutHandler from './ShortcutHandler.vue'
import ShortcutHelpModal from './ShortcutHelpModal.vue'
import zIndex from '../libs/z-index'

const { currentRoute } = useRouter()
const config = inject<Ref<{ config: Model.Config }>>('config')

const configModal = ref(false)
const shortcutModal = $ref(false)

const configRef = ref<InstanceType<typeof Config> | null>(null)

watch(configModal, () => {
  if (!configModal.value) return
  configRef.value?.reset()
})
</script>

<template>
  <div v-motion-fade :class="['min-h-screen', zIndex.APP_DIV]">
    <header
      class="h-[60px] grid grid-cols-[2fr,6fr,2fr] gap-2 place-content-center items-center px-[60px] border-b border-blue/20"
      data-tauri-drag-region
    >
      <div class="flex items-center gap-2">
        <modal-vue
          :visible="configModal"
          @close="configModal = false"
          ok-text="Save"
          title="Settings"
          @ok="configRef?.submitConfig()"
        >
          <Suspense>
            <config ref="configRef" @submit="configModal = false" />

            <template #fallback> Loading... </template>
          </Suspense>
        </modal-vue>

        <shortcut-help-modal
          :visible="shortcutModal"
          @close="shortcutModal = false"
        />

        <dropdown-vue as="button">
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

              <button
                @click="shortcutModal = true"
                class="py-2 px-3 w-full text-left hover:bg-blue hover:text-white duration-100"
              >
                <span class="fa fa-keyboard mr-2" />Shortcuts
              </button>
            </div>
          </template>
        </dropdown-vue>

        <div class="text-blue">
          Hi {{ config?.config.display_name }}. You look good!
        </div>
      </div>

      <div class="flex justify-center gap-2 h-full items-center">
        <router-link
          v-for="route in routes"
          :class="`py-2 px-4 hover:bg-blue-tint/40 hover:text-white text-blue ${
            currentRoute.path === route.path ? `!bg-blue-tint !text-white` : ``
          } rounded-md duration-100 ease-in-out`"
          :to="route.path"
          :key="route.path"
        >
          <span v-if="route.name !== 'Home'">{{ route.name }}</span>
          <span v-else class="fa fa-home" />
        </router-link>
      </div>

      <div
        v-if="isTauri()"
        class="flex gap-2 justify-end items-center -mr-[48px]"
      >
        <button @click="appWindow.minimize()" class="button-3rd">
          <span class="fa fa-window-minimize" />
        </button>

        <button @click="appWindow.toggleMaximize()" class="button-3rd">
          <span class="fa fa-window-restore" />
        </button>

        <confirm
          message="You are exitting!"
          @ok="appWindow.close()"
          ok-text="Exit"
        >
          <button class="button-3rd">
            <span class="fa fa-window-close" />
          </button>
        </confirm>
      </div>
    </header>

    <shortcut-handler />
    <subscription-handler />

    <main
      class="px-[60px] pb-[20px] h-[clamp(0px,calc(100vh-140px),calc(100vh-140px))]"
    >
      <slot></slot>
    </main>

    <toast-handler />
  </div>
</template>
