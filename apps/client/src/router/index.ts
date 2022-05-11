import { createRouter, createWebHistory } from 'vue-router'
import HomeVue from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeVue,
    },
  ],
})

export default router
