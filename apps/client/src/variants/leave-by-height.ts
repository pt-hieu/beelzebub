import type { MotionVariants } from '@vueuse/motion'

export const leaveByHeightVariant: MotionVariants = {
  initial: { opacity: 0, maxHeight: 0 },
  enter: {
    opacity: 1,
    maxHeight: 999,
    transition: {
      opacity: {
        delay: 300,
        duration: 200,
      },
      maxHeight: {
        duration: 500,
      },
    },
  },
  leave: {
    opacity: 0,
    maxHeight: 0,
  },
}
