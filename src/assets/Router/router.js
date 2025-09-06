import { createRouter, createWebHistory } from 'vue-router'
import MedicamentosView from '../../views/MedicamentosView.vue'
import FerragensView from '../../views/FerragensView.vue'
import MedicaFiltro from '../components/MedicaFiltro.vue';
import produtosList from '../components/produtosList.vue';
import FerragensFiltro from '../components/FerragensFiltro.vue';
import Header from '../components/Header.vue';

const routes = [

  {
    path: '/medicamentos',
    component: MedicamentosView,
    name: 'MedicamentosView'
  },
  {
    path: '/ferragens',
    component: FerragensView,
    name: 'FerragensView'
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
  {

    path: '/ferragens-filtro',
    component: FerragensFiltro,
    name: 'FerragensFiltro'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
