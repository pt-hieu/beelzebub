<script lang="ts" setup>
import Modal from './Modal.vue'
import { shortcuts, type Shortcut } from '../shortcuts.js'
import ShortcutKey from './KeyCode.vue'

type Props = {
  visible: boolean
}

const { visible } = defineProps<Props>()
const emit = defineEmits(['close'])

const shortcutDict = shortcuts.reduce(
  (sum, sc) => ({ ...sum, [sc.tag]: (sum[sc.tag] || []).concat(sc) }),
  {} as Record<string, Shortcut[]>,
)

const tags = Object.keys(shortcutDict)
</script>

<template>
  <modal
    :visible="visible"
    @close="emit('close')"
    ok-text="Close"
    title="Shortcuts"
    @ok="emit('close')"
  >
    <div class="grid grid-cols-2">
      <div v-for="tag in tags" :key="tag" class="min-w-[450px]">
        <div class="capitalize text-lg">
          {{ tag }}
        </div>

        <div class="mt-2 flex flex-col gap-2 text-sm">
          <div
            class="grid grid-cols-[1fr,150px] items-center"
            v-for="shortcut in shortcutDict[tag]"
            :key="shortcut.keys"
          >
            <span>{{ shortcut.description }}</span>
            <shortcut-key :keys="shortcut.keys" :deli="'+'" />
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
