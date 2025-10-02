<script setup>
import Header from '@/assets/components/Header.vue'
import RacoesFiltro from '@/assets/components/RacoesFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref, inject, watch, defineProps } from 'vue'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function })

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
        <RacoesFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
      </aside>
      <main class="produtos-area">
        <ProdutosList :produtos="produtosFiltrados" :adicionar-ao-carrinho="props.adicionarAoCarrinho" />
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
