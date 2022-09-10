<script lang="ts" setup>
type Props = {
  text: string
}

const { text } = defineProps<Props>()
const emit = defineEmits({
  toggle: (value: boolean) => true,
})

let expand = $ref(false)
</script>

<template>
  <button
    @click="emit('toggle', (expand = !expand))"
    :class="`grid place-content-center border rounded-md duration-100 h-[185px] ${
      expand ? 'text-gray border-gray' : 'text-blue border-blue'
    }`"
  >
    <span class="fa fa-folder !text-3xl mb-1" />

    <span>
      {{ text }}
    </span>
  </button>
</template>
