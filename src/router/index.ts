import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/MainView/HomeView/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HOME',
      component: HomeView
    },
  ]
})

export default router
