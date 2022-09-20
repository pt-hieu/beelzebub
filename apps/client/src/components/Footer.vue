<script lang="ts" setup>
import zIndex from '../libs/z-index'
</script>

<template>
  <teleport to="#app">
    <footer
      :class="[
        'fixed bottom-0 right-0 left-0 mx-[60px] gap-2 h-[80px] bg-white dark:bg-$blue',
        'rounded-t-3xl shadow-[0px_8px_20px_0px_rgba(90,123,181,0.7)]',
        'dark:shadow-[0px_8px_20px_0px_rgba(90,123,181,0.7)]',
        'flex items-center justify-center',
        zIndex.FOOTER,
      ]"
      @click.stop
    >
      <slot />
    </footer>
  </teleport>
</template>
