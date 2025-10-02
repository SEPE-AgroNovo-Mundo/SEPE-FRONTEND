<script setup>
import Header from '@/assets/components/Header.vue'
import DedetizacaoFiltro from '@/assets/components/DedetizacaoFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref, inject, watch, defineProps } from 'vue'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function })

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
    <div class="conteudo">
      <aside class="filtro-lateral">
        <DedetizacaoFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
      </aside>
      <main class="produtos-area">
        <ProdutosList :produtos="produtosFiltrados" :adicionar-ao-carrinho="props.adicionarAoCarrinho" />
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

.filtro-lateral {
  flex: 0 0 340px;
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
}
</style>
