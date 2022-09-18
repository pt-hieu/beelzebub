<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { useAttrs } from 'vue'
import Dropdown from './Dropdown.vue'

type Extension = {
  label: string
  icon?: `${'fa' | 'fab'} fa-${string}`
  disabled?: boolean
} & ({ link: string; event?: never } | { link?: never; event: string })

type Props = {
  extensions?: Extension[]
  buttonDisabled?: boolean
}

const { extensions = [], buttonDisabled = false } = defineProps<Props>()
const emit = defineEmits({})
const attrs = useAttrs()
</script>

<template>
  <span>
    <button
      v-bind="$attrs"
      :disabled="buttonDisabled"
      :class="`!rounded-r-none !border-r-0`"
    >
      <slot />
    </button>

    <dropdown
      :container-attrs="{ class: 'inline-block' }"
      as="button"
      :class="`!rounded-l-none !px-3 ${attrs.class}`"
    >
      <span class="fa fa-caret-down" />

      <template #overlay>
        <div
          class="min-w-[200px] rounded-md bg-white border border-blue/30 flex flex-col py-2 text-blue shadow"
        >
          <template v-for="ext in extensions" :key="ext.label">
            <button
              :disabled="ext.disabled"
              v-if="!!ext.event"
              class="py-2 px-3 w-full text-left hover:bg-blue hover:text-white duration-100 grid grid-cols-[30px,1fr] gap-2 items-center disabled:!bg-gray disabled:!text-white"
              @click="ext.event && emit(ext.event)"
            >
              <span
                v-if="!!ext.icon"
                :class="`${ext.icon} inline-block mx-auto`"
              />
              {{ ext.label }}
            </button>

            <a
              v-else-if="!!ext.link"
              :href="ext.disabled ? undefined : ext.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                :disabled="ext.disabled"
                class="py-2 px-3 w-full text-left hover:bg-blue hover:text-white duration-100 grid grid-cols-[30px,1fr] gap-2 items-center disabled:!bg-gray disabled:!text-white"
              >
                <span
                  v-if="!!ext.icon"
                  :class="`${ext.icon} inline-block mx-auto`"
                />
                {{ ext.label }}
              </button>
            </a>
          </template>
        </div>
      </template>
    </dropdown>
  </span>
</template>
