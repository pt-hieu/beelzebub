<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import Dropdown from './Dropdown.vue'
type Extension = {
  label: string
  icon?: `${'fa' | 'fab'} fa-${string}`
} & ({ link: string; event?: never } | { link?: never; event: string })

type Props = {
  extensions?: Extension[]
}

const { extensions = [] } = defineProps<Props>()
const emit = defineEmits({})
</script>

<template>
  <span>
    <button v-bind="$attrs" :class="`!rounded-r-none !border-r-0`">
      <slot />
    </button>

    <dropdown class="inline-block">
      <template #overlay>
        <div
          class="min-w-[200px] rounded-md bg-white border border-blue/30 flex flex-col py-2 text-blue shadow"
        >
          <template v-for="ext in extensions" :key="ext.label">
            <button
              v-if="!!ext.event"
              class="py-2 px-3 w-full text-left hover:bg-blue hover:text-white duration-100 grid grid-cols-[30px,1fr] gap-2 items-center"
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
              :href="ext.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                class="py-2 px-3 w-full text-left hover:bg-blue hover:text-white duration-100 grid grid-cols-[30px,1fr] gap-2 items-center"
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

      <button v-bind="$attrs" class="!rounded-l-none !px-3">
        <span class="fa fa-caret-down" />
      </button>
    </dropdown>
  </span>
</template>
