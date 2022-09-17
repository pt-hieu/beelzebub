<script lang="ts" setup>
import moment from 'moment'
import { onMounted, reactive } from 'vue'

const style = reactive({ top: '32px', left: '0px' })
onMounted(() => {
  const now = moment()
  const currentHour = now.get('hour')

  const weekDayElement = document.querySelector(
    `div[data-vue-type='week-day']`,
  ) as HTMLDivElement

  style.top = 32 + currentHour * 70 + 'px'
  style.left = weekDayElement?.getBoundingClientRect().left - 60 + 'px'
})
</script>

<template>
  <div :style="style" class="absolute w-[calc(100%-(100vw-120px)/8)] h-[70px]">
    <div class="bg-blue/40 w-full h-[3px] relative top-[calc(35px-1px)]" />
  </div>
</template>
