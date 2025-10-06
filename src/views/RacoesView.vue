<script setup>
import Header from '@/assets/components/Header.vue'
import RacoesFiltro from '@/assets/components/RacoesFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref, inject, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function, favoritos: Array })
const emit = defineEmits(['toggle-favorito'])

const produtos = ref([
  {
    id: 1,
    nome: 'Ração Farmina ND Ocean Salmão e Cordeiro',
    marca: 'Farmina',
    categoria: 'Cachorro',
    tipo: 'Adulto',
    peso: '7.5 Kg',
    opcao: '1 Unidade',
    preco: 464.06,
    imagem: 'https://via.placeholder.com/120x120?text=Racao+1',
    descricao: 'Ração premium para cães adultos sabor salmão e cordeiro.'
  },
  {
    id: 2,
    nome: 'Ração ND Quinoa Skin & Coat',
    marca: 'Farmina',
    categoria: 'Gatos',
    tipo: 'Adulto',
    peso: '1.5 Kg',
    opcao: '1 Unidade',
    preco: 232.09,
    imagem: 'https://via.placeholder.com/120x120?text=Racao+2',
    descricao: 'Ração ND Quinoa para gatos adultos.'
  },
  {
    id: 3,
    nome: 'Ração Upper Premium',
    marca: 'Upper',
    categoria: 'Cachorro',
    tipo: 'Filhote',
    peso: '10.1 Kg',
    opcao: '1 Unidade',
    preco: 195.90,
    imagem: 'https://via.placeholder.com/120x120?text=Racao+3',
    descricao: 'Ração Upper para cães filhotes.'
  },
  {
    id: 4,
    nome: 'Ração GMP PET Adulto',
    marca: 'GMP PET',
    categoria: 'Cachorro',
    tipo: 'Adulto',
    peso: '20 Kg',
    opcao: '1 Unidade',
    preco: 253.08,
    imagem: 'https://via.placeholder.com/120x120?text=Racao+4',
    descricao: 'Ração GMP PET para cães adultos.'
  },
  {
    id: 5,
    nome: 'Ração Neovia Selection',
    marca: 'Neovia',
    categoria: 'Gatos',
    tipo: 'Adulto',
    peso: '1.5 Kg',
    opcao: '1 Unidade',
    preco: 130.40,
    imagem: 'https://via.placeholder.com/120x120?text=Racao+5',
    descricao: 'Ração Neovia para gatos adultos.'
  }
])

const produtosFiltrados = ref([...produtos.value])
const termoBuscaGlobal = inject('termoBuscaGlobal')
const filtrosAtuais = ref({ categorias: [], marcas: [], tipos: [], pesos: [], opcoes: [], busca: {}, ordenacao: '' })
const termoBusca = ref('')

const filtroAberto = ref(true)
function alternarFiltro() {
  filtroAberto.value = !filtroAberto.value
}

watch(termoBuscaGlobal, () => {
  filtrarProdutos(filtrosAtuais.value)
})

watch(termoBusca, () => {
  filtrarProdutos(filtrosAtuais.value)
})

function filtrarProdutos(filtros) {
  filtrosAtuais.value = JSON.parse(JSON.stringify(filtros))
  let lista = produtos.value
  if (filtros.categorias.length) lista = lista.filter(p => filtros.categorias.includes(p.categoria))
  if (filtros.marcas.length) lista = lista.filter(p => filtros.marcas.includes(p.marca))
  if (filtros.tipos.length) lista = lista.filter(p => filtros.tipos.includes(p.tipo))
  if (filtros.pesos.length) lista = lista.filter(p => filtros.pesos.includes(p.peso))
  if (filtros.opcoes.length) lista = lista.filter(p => filtros.opcoes.includes(p.opcao))
  if (filtros.busca.categoria) lista = lista.filter(p => p.categoria.toLowerCase().includes(filtros.busca.categoria.toLowerCase()))
  if (filtros.busca.marca) lista = lista.filter(p => p.marca.toLowerCase().includes(filtros.busca.marca.toLowerCase()))
  if (filtros.busca.tipo) lista = lista.filter(p => p.tipo && p.tipo.toLowerCase().includes(filtros.busca.tipo.toLowerCase()))
  if (filtros.busca.peso) lista = lista.filter(p => p.peso && p.peso.toLowerCase().includes(filtros.busca.peso.toLowerCase()))
  if (filtros.busca.opcao) lista = lista.filter(p => p.opcao && p.opcao.toLowerCase().includes(filtros.busca.opcao.toLowerCase()))
  if (filtros.ordenacao === 'Menor preço') lista = [...lista].sort((a, b) => a.preco - b.preco)
  else if (filtros.ordenacao === 'Maior preço') lista = [...lista].sort((a, b) => b.preco - a.preco)
  // Filtro global pelo nome:
  if (termoBuscaGlobal && termoBuscaGlobal.value) {
    const termo = termoBuscaGlobal.value.toLowerCase()
    lista = lista.filter(p => p.nome.toLowerCase().includes(termo))
  }
  if (termoBusca.value) {
    const termo = termoBusca.value.toLowerCase()
    lista = lista.filter(p => p.nome.toLowerCase().includes(termo))
  }
  produtosFiltrados.value = lista
}
</script>

<template>
  <div class="racoes-view">
    <Header v-model="termoBusca" :onAbrirCarrinho="props.abrirCarrinho" />
    <div class="conteudo">
      <aside class="filtro-lateral">
        <button class="btn-toggle-filtro" @click="alternarFiltro">
          {{ filtroAberto ? 'Recolher Filtros ▲' : 'Exibir Filtros ▼' }}
        </button>
        <transition name="fade">
          <div v-show="filtroAberto">
            <RacoesFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
          </div>
        </transition>
      </aside>
      <main class="produtos-area">
        <ProdutosList
          :produtos="produtosFiltrados"
          :adicionarAoCarrinho="props.adicionarAoCarrinho"
          :favoritos="props.favoritos"
          @toggle-favorito="emit('toggle-favorito', $event)"
        />
      </main>
    </div>
  </div>
</template>

<style scoped>
.racoes-view {
  background: #f3f6fa;
  min-height: 100vh;
}

.conteudo {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  margin: 40px auto 0 auto;
  padding: 0 32px;
}

.filtro-lateral {
  position: sticky;
  top: 88px;
  height: fit-content;
}

.produtos-area {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.btn-toggle-filtro {
  display: none;
  margin-bottom: 10px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}

@media (max-width: 900px) {
  .conteudo {
    flex-direction: column;
    gap: 24px;
    padding: 0 8px;
  }

  .filtro-lateral {
    position: static;
    width: 100%;
    margin-bottom: 16px;
  }

  .btn-toggle-filtro {
    display: block;
  }
}

@media (max-width: 900px) {
  .container, .main-content, .view-content {
    padding: 0 2vw;
    width: 100vw;
    min-width: 0;
    box-sizing: border-box;
  }
}
@media (max-width: 600px) {
  .container, .main-content, .view-content {
    padding: 0 1vw;
    width: 100vw;
    min-width: 0;
    box-sizing: border-box;
  }
  h1, h2, h3, h4 {
    font-size: 1.1em;
  }
}
@media (max-width: 440px) {
  .container, .main-content, .view-content {
    padding: 0 0.5vw;
    width: 100vw;
    min-width: 0;
    box-sizing: border-box;
  }
  h1, h2, h3, h4 {
    font-size: 1em;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
