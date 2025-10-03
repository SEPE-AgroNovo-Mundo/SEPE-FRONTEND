import { createRouter, createWebHistory } from 'vue-router'
import MedicamentosView from '../../views/MedicamentosView.vue'
import FerragensView from '../../views/FerragensView.vue'
import HormoniosView from '../../views/HormoniosView.vue'
import HormoniosFiltro from '../components/HormoniosFiltro.vue';
import MedicaFiltro from '../components/MedicaFiltro.vue';
import FerragensFiltro from '../components/FerragensFiltro.vue';
import RacoesFiltro from '../components/RacoesFiltro.vue';
import RacoesView from '../../views/RacoesView.vue';
import DedetizacaoView from '../../views/DedetizacaoView.vue';
import DedetizacaoFiltro from '../components/DedetizacaoFiltro.vue';
import PetsFiltro from '../components/PetsFiltro.vue';
import PetsView from '../../views/PetsView.vue';
import Header from '../components/Header.vue';
import UsuarioPerfil from '../components/UsuarioPerfil.vue';

const routes = [
  {
    path: '/',
    component: MedicamentosView, // ou outro componente principal desejado
    name: 'Home'
  },
  {
    path: '/medicamentos',
    component: MedicamentosView,
    name: 'MedicamentosView'
  },
  {
    path: '/perfil',
    component: UsuarioPerfil,
    name: 'UsuarioPerfil'
  },
  {
    path: '/ferragens',
    component: FerragensView,
    name: 'FerragensView'
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
  },
  {
    path: '/hormonios',
    component: HormoniosView,
    name: 'HormoniosView'
  },
  {
    path: '/hormonios-filtro',
    component: HormoniosFiltro,
    name: 'HormoniosFiltro'
  },
  {
    path: '/racoes',
    component: RacoesView,
    name: 'RacoesView'
  },
  {
    path: '/racoes-filtro',
    component: RacoesFiltro,
    name: 'RacoesFiltro'
  },
  {
    path: '/pragas',
    component: DedetizacaoView,
    name: 'DedetizadoraView'
  },
  {
    path: '/pragas-filtro',
    component: DedetizacaoFiltro,
    name: 'DedetizacaoFiltro'
  },
  {
    path: '/pets',
    component: PetsView,
    name: 'PetsView'
  },
  {
    path: '/pets-filtro',
    component: PetsFiltro,
    name: 'PetsFiltro'
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
