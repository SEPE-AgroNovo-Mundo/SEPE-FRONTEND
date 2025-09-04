import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '../components/InicioView.vue'


const routes = [
  {
    path: '/inicio',
    component: InicioView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
