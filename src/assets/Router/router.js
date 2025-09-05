import { createRouter, createWebHistory } from 'vue-router'
import MedicamentosView from '../../views/MedicamentosView.vue'
import MedicaFiltro from '../components/MedicaFiltro.vue';
import produtosList from '../components/produtosList.vue';
import Header from '../components/Header.vue';

const routes = [

  {
    path: '/medicamentos',
    component: MedicamentosView,
    name: 'MedicamentosView'
  },
  {
    path: '/produtos-list',
    component: produtosList,
    name: 'ProdutosList'
  },
  {
    path: '/header',
    component: Header,
    name: 'Header'
  },
  {
    path: '/medica',
    component: MedicaFiltro,
    name: 'MedicaFiltro'
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
