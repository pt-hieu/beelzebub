import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeVue from '@/views/Home.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeVue,
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: HomeVue,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

export default router
