<script lang="ts" setup>
const props = defineProps<{
  isLoading: boolean
}>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <slot v-if="!isLoading" />

  <div class="lds-ring" v-bind="$attrs" v-else>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
