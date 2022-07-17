import type { MotionVariants } from '@vueuse/motion'

export const leaveByWidthVariant: MotionVariants = {
  initial: { opacity: 0, maxWidth: 0 },
  enter: {
    opacity: 1,
    maxWidth: 999,
    transition: {
      opacity: {
        delay: 300,
        duration: 200,
      },
      maxWidth: {
        duration: 500,
      },
    },
  },
  leave: {
    opacity: 0,
    maxWidth: 0,
  },
}
