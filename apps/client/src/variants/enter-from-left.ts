import type { MotionVariants } from '@vueuse/motion'

export const enterFromLeft: MotionVariants = {
  initial: { opacity: 0, x: 200 },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      ease: 'linear',
    },
  },
  leave: { opacity: 0, x: 150 },
}
