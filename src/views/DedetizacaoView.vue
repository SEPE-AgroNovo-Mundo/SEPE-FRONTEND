<script setup>
import Header from '@/assets/components/Header.vue'
import DedetizacaoFiltro from '@/assets/components/DedetizacaoFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref, inject, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function, favoritos: Array })
const emit = defineEmits(['toggle-favorito'])

const produtos = ref([
  {
    id: 1,
    nome: 'Rodilon Pellets',
    marca: 'Bayer',
    categoria: 'Raticidas',
    tipo: 'Roedores',
    volume: '100 g',
    peso: '100 g',
    opcao: 'Único',
    preco: 3.15,
    imagem: 'https://via.placeholder.com/120x120?text=Rodilon',
    descricao: 'Isca para combate de roedores.'
  },
  {
    id: 2,
    nome: 'Ficam VC',
    marca: 'Bayer',
    categoria: 'Inseticidas',
    tipo: 'Insetos',
    volume: '100 ml',
    peso: '100 g',
    opcao: 'Único',
    preco: 22.10,
    imagem: 'https://via.placeholder.com/120x120?text=Ficam',
    descricao: 'Controle de pragas.'
  },
  {
    id: 3,
    nome: 'Rodilon Soft Bait',
    marca: 'Bayer',
    categoria: 'Raticidas',
    tipo: 'Roedores',
    volume: '100 g',
    peso: '100 g',
    opcao: 'Único',
    preco: 17.59,
    imagem: 'https://via.placeholder.com/120x120?text=Rodilon+Soft',
    descricao: 'Isca fresca e atrativa para roedores.'
  },
  {
    id: 4,
    nome: 'K-Othrine SC 25',
    marca: 'Bayer',
    categoria: 'Inseticidas',
    tipo: 'Insetos',
    volume: '100 ml',
    peso: '100 g',
    opcao: 'Único',
    preco: 11.21,
    imagem: 'https://via.placeholder.com/120x120?text=K-Othrine',
    descricao: 'Protege sua casa por até 3 meses.'
  },
  {
    id: 5,
    nome: 'Diazitop PM',
    marca: 'Diazitop',
    categoria: 'Formicidas',
    tipo: 'Formiga',
    volume: '100 ml',
    peso: '100 g',
    opcao: 'Único',
    preco: 61.31,
    imagem: 'https://via.placeholder.com/120x120?text=Diazitop',
    descricao: 'Controle de formigas.'
  }
])

const produtosFiltrados = ref([...produtos.value])
const termoBuscaGlobal = inject('termoBuscaGlobal')

const filtrosAtuais = ref({
  categorias: [],
  marcas: [],
  tipos: [],
  volumes: [],
  pesos: [],
  opcoes: [],
  busca: {},
  ordenacao: ''
})

const termoBusca = ref('')
const filtroVisivel = ref(true)
const filtroAberto = ref(true)

function alternarFiltro() {
  filtroAberto.value = !filtroAberto.value
}

watch(termoBuscaGlobal, () => {
  filtrarProdutos(filtrosAtuais.value)
})

watch(termoBusca, () => {
  filtrarProdutos({ categorias: [], marcas: [], tipos: [], volumes: [], pesos: [], opcoes: [], busca: {}, ordenacao: '' })
})

function filtrarProdutos(filtros) {
  filtrosAtuais.value = JSON.parse(JSON.stringify(filtros))
  let lista = produtos.value
  if (filtros.categorias.length) lista = lista.filter(p => filtros.categorias.includes(p.categoria))
  if (filtros.marcas.length) lista = lista.filter(p => filtros.marcas.includes(p.marca))
  if (filtros.tipos.length) lista = lista.filter(p => filtros.tipos.includes(p.tipo))
  if (filtros.volumes.length) lista = lista.filter(p => filtros.volumes.includes(p.volume))
  if (filtros.pesos.length) lista = lista.filter(p => filtros.pesos.includes(p.peso))
  if (filtros.opcoes.length) lista = lista.filter(p => filtros.opcoes.includes(p.opcao))
  if (filtros.busca.categoria) lista = lista.filter(p => p.categoria.toLowerCase().includes(filtros.busca.categoria.toLowerCase()))
  if (filtros.busca.marca) lista = lista.filter(p => p.marca.toLowerCase().includes(filtros.busca.marca.toLowerCase()))
  if (filtros.busca.tipo) lista = lista.filter(p => p.tipo && p.tipo.toLowerCase().includes(filtros.busca.tipo.toLowerCase()))
  if (filtros.busca.volume) lista = lista.filter(p => p.volume && p.volume.toLowerCase().includes(filtros.busca.volume.toLowerCase()))
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
  <div class="dedetizacao-view">
    <Header v-model="termoBusca" :onAbrirCarrinho="props.abrirCarrinho" />
    <div class="conteudo" :class="{ expandido: !filtroVisivel }">
      <aside class="filtro-lateral" v-if="filtroVisivel">
        <button class="btn-toggle-filtro" @click="alternarFiltro">
          {{ filtroAberto ? 'Recolher Filtros ▲' : 'Exibir Filtros ▼' }}
        </button>
        <transition name="fade">
          <div v-show="filtroAberto">
            <DedetizacaoFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
          </div>
        </transition>
      </aside>
      <main class="produtos-area" :class="{ expandido: !filtroVisivel }">
        <ProdutosList :produtos="produtosFiltrados" :adicionarAoCarrinho="props.adicionarAoCarrinho" :favoritos="props.favoritos" @toggle-favorito="emit('toggle-favorito', $event)" :expandido="!filtroVisivel" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dedetizacao-view {
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

.conteudo.expandido {
  max-width: 100vw;
  width: 100vw;
  margin: 0;
  padding: 0;
  gap: 0;
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

.produtos-area.expandido {
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 1 1 100%;
  box-sizing: border-box;
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
  .btn-toggle-filtro {
    display: block;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 1400px) {
  .conteudo.expandido,
  .produtos-area.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }
}
@media (max-width: 900px) {
  .conteudo.expandido,
  .produtos-area.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }
}
@media (max-width: 600px) {
  .conteudo.expandido,
  .produtos-area.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }
}

.toggle-filtro-btn {
  margin: 24px auto 0 auto;
  display: block;
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #f4511e22;
  transition: background 0.2s;
}
.toggle-filtro-btn:hover {
  background: #d84315;
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

  .produtos-area.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
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
</style>
