<script lang="ts" setup></script>

<template>
  <div class="fixed bottom-0 right-0 left-0 px-[60px]">
    <footer
      class="h-[80px] w-full flex gap-2 items-center justify-center border border-b-0 border-blue/20 rounded-t-3xl shadow-2xl shadow-blue"
    >
      <slot />
    </footer>
  </div>
</template>
