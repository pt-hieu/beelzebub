<script lang="ts" setup>
import { useToast } from '@/pinia/toast'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDispatchPiniaEvent } from '../composables/useDispatchPiniaEvent.js'
import Loading from './Loading.vue'

const toastStore = useToast()
const { currentRoute } = useRouter()

const dispatch = useDispatchPiniaEvent()
let hasFooter = $ref(false)

watch(
  () => currentRoute.value.path,
  () => {
    const footers = Array.from(document.getElementsByTagName('footer'))
    hasFooter = !!footers.length
  },
  { flush: 'pre' },
)
</script>

<template>
  <TransitionGroup
    tag="div"
    name="list"
    :class="`fixed z-[9999] flex flex-col-reverse gap-4 left-1/2 -translate-x-1/2 ${
      hasFooter ? 'bottom-[96px]' : 'bottom-[16px]'
    }`"
  >
    <div
      v-for="toast in toastStore.items"
      :key="toast.id"
      class="px-3 py-4 rounded-md shadow-md shadow-blue/30 border-t border-blue/40 bg-white w-[300px]"
    >
      <div class="flex items-center justify-between">
        <div class="text-blue-shade font-medium flex gap-2">
          {{ toast.type }}

          <span v-if="toast.type === 'Success'" class="fa fa-check" />
          <span v-else-if="toast.type === 'Error'" class="fa fa-warning" />
          <span
            v-else-if="toast.type === 'Info'"
            class="fa fa-info relative bottom-[1px]"
          />
          <loading v-else :is-loading="true" class="relative top-0.5" />
        </div>

        <button @click="toastStore.remove(toast.id)">
          <span class="fa fa-times text-blue-tint relative bottom-[1px]" />
        </button>
      </div>

      <div class="text-sm">{{ toast.message }}</div>

      <div class="mt-2 flex justify-end gap-2 text-sm">
        <button
          class="button-2nd !py-1.5 rounded-sm"
          v-for="action in toast.actions"
          :key="action.event"
          @click="dispatch(undefined, action.event)"
        >
          <span v-if="!!action.icon" :class="`${action.icon} mr-2`" />
          {{ action.label }}
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
