<script setup>
import Header from '@/assets/components/Header.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import FerragensFiltro from '@/assets/components/FerragensFiltro.vue'
import Footer from '@/assets/components/Footer.vue'
import { ref, inject, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function, favoritos: Array })
const emit = defineEmits(['toggle-favorito'])

const produtos = ref([
  {
    id: 1,
    nome: 'Arame Cordoalha 7 Fios 250m',
    marca: 'Belgo',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: '1 Kg',
    opcao: '250 Metros',
    preco: 2083.56,
    imagem: 'https://via.placeholder.com/120x120?text=Arame+1',
    descricao: 'Cordoalha de aço galvanizado para cercas rurais.'
  },
  {
    id: 2,
    nome: 'Arame Ovalado Fortte 1000m',
    marca: 'Fortit',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: '100 Metros',
    opcao: '1000 Metros',
    preco: 1322.60,
    imagem: 'https://via.placeholder.com/120x120?text=Arame+2',
    descricao: 'Arame ovalado de alta resistência para cercas.'
  },
  {
    id: 3,
    nome: 'Arame farpado Motto 500 m',
    marca: 'Belgo',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: 'Nº 16',
    opcao: '500 Metros',
    preco: 499.59,
    imagem: 'https://via.placeholder.com/120x120?text=Arame+3',
    descricao: 'Arame farpado Motto para cercas rurais.'
  },
  {
    id: 4,
    nome: 'Arame Liso Ovalado 1000m Z-700',
    marca: 'Belgo',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: 'Nº 18',
    opcao: '1000 Metros',
    preco: 818.69,
    imagem: 'https://via.placeholder.com/120x120?text=Arame+4',
    descricao: 'Arame liso ovalado de alta durabilidade.'
  },
  {
    id: 5,
    nome: 'Grampo Galvanizado 9x1 20Kg',
    marca: 'Fábrica de Pregos',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: 'Nº 20',
    opcao: '20Kg',
    preco: 299.90,
    imagem: 'https://via.placeholder.com/120x120?text=Grampo+1',
    descricao: 'Grampo galvanizado para reforço de cerca.'
  },
  {
    id: 6,
    nome: 'Isolador para Vaso de Madeira',
    marca: 'Prata Brito',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: 'Nº 16',
    opcao: 'Único',
    preco: 19.90,
    imagem: 'https://via.placeholder.com/120x120?text=Isolador+1',
    descricao: 'Isolador para cerca elétrica em vaso de madeira.'
  },
  {
    id: 7,
    nome: 'União com Rosca e Redução 1 X 3/4',
    marca: 'Cipla',
    categoria: 'Hidráulicos',
    volume: '65 Litros',
    peso: 'Nº 18',
    opcao: '1/2"',
    preco: 14.90,
    imagem: 'https://via.placeholder.com/120x120?text=Uniao+1',
    descricao: 'União para tubos hidráulicos com rosca.'
  },
  {
    id: 8,
    nome: 'Arame farpado - Fortte 500m',
    marca: 'Fortit',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: 'Nº 20',
    opcao: '500 Metros',
    preco: 399.90,
    imagem: 'https://via.placeholder.com/120x120?text=Arame+5',
    descricao: 'Arame farpado Fortte para cercas.'
  },
  {
    id: 9,
    nome: 'Arame farpado Rodeio 100m',
    marca: 'Belgo',
    categoria: 'Ferragens',
    volume: '65 Litros',
    peso: '1 Kg',
    opcao: '100 Metros',
    preco: 99.90,
    imagem: 'https://via.placeholder.com/120x120?text=Arame+6',
    descricao: 'Arame farpado Rodeio para cercas urbanas e rurais.'
  },
  {
    id: 10,
    nome: 'União Tipo T Triplo - 1/2"',
    marca: 'Cipla',
    categoria: 'Hidráulicos',
    volume: '65 Litros',
    peso: 'Nº 16',
    opcao: '1/2"',
    preco: 12.90,
    imagem: 'https://via.placeholder.com/120x120?text=Uniao+2',
    descricao: 'União tipo T para tubos hidráulicos.'
  }
])

const termoBuscaGlobal = inject('termoBuscaGlobal')

const produtosFiltrados = ref([...produtos.value])

const filtrosAtuais = ref({
  categorias: [],
  marcas: [],
  volumes: [],
  pesos: [],
  opcoes: [],
  busca: {},
  ordenacao: ''
})

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
  if (filtros.categorias.length) {
    lista = lista.filter(p => filtros.categorias.includes(p.categoria))
  }
  if (filtros.marcas.length) {
    lista = lista.filter(p => filtros.marcas.includes(p.marca))
  }
  if (filtros.pesos.length) {
    lista = lista.filter(p => filtros.pesos.includes(p.peso))
  }
  if (filtros.opcoes.length) {
    lista = lista.filter(p => filtros.opcoes.includes(p.opcao))
  }
  if (filtros.busca.categoria) {
    lista = lista.filter(p => p.categoria.toLowerCase().includes(filtros.busca.categoria.toLowerCase()))
  }
  if (filtros.busca.marca) {
    lista = lista.filter(p => p.marca.toLowerCase().includes(filtros.busca.marca.toLowerCase()))
  }
  if (filtros.busca.peso) {
    lista = lista.filter(p => p.peso.toLowerCase().includes(filtros.busca.peso.toLowerCase()))
  }
  if (filtros.busca.opcao) {
    lista = lista.filter(p => p.opcao.toLowerCase().includes(filtros.busca.opcao.toLowerCase()))
  }
  if (filtros.busca.volume) {
    lista = lista.filter(p => p.volume && p.volume.toLowerCase().includes(filtros.busca.volume.toLowerCase()))
  }
  if (filtros.ordenacao === 'Menor preço') {
    lista = [...lista].sort((a, b) => a.preco - b.preco)
  } else if (filtros.ordenacao === 'Maior preço') {
    lista = [...lista].sort((a, b) => b.preco - a.preco)
  }
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
  <div class="ferragens-view">
    <Header v-model="termoBusca" :onAbrirCarrinho="props.abrirCarrinho" />
    <div class="conteudo">
      <aside class="filtro-lateral">
        <button class="btn-toggle-filtro" @click="alternarFiltro">
          {{ filtroAberto ? 'Recolher Filtros ▲' : 'Exibir Filtros ▼' }}
        </button>
        <transition name="fade">
          <div v-show="filtroAberto">
            <FerragensFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
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
    <Footer />
  </div>
</template>

<style scoped>
.ferragens-view {
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
