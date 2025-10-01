<script setup>
import Header from '@/assets/components/Header.vue'
import PetsFiltro from '@/assets/components/PetsFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref, inject, watch, defineProps } from 'vue'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function })

const produtos = ref([
  {
    id: 1,
    nome: 'Coleira Antipulgas',
    marca: 'Seresto',
    categoria: 'Coleiras',
    tipo: 'Cachorro',
    cor: 'Azul',
    opcao: 'Único',
    preco: 89.90,
    imagem: 'https://via.placeholder.com/120x120?text=Coleira',
    descricao: 'Coleira antipulgas para cães, proteção por até 8 meses.'
  },
  {
    id: 2,
    nome: 'Pote de Ração 2L',
    marca: 'Plasvale',
    categoria: 'Potes',
    tipo: 'Gato',
    cor: 'Branco',
    opcao: 'Único',
    preco: 19.90,
    imagem: 'https://via.placeholder.com/120x120?text=Pote',
    descricao: 'Pote de ração para gatos, capacidade de 2 litros.'
  },
  {
    id: 3,
    nome: 'Brinquedo Bola Interativa',
    marca: 'Pet Games',
    categoria: 'Brinquedos',
    tipo: 'Cachorro',
    cor: 'Vermelho',
    opcao: 'Único',
    preco: 29.90,
    imagem: 'https://via.placeholder.com/120x120?text=Bola',
    descricao: 'Bola interativa para cães, estimula o exercício.'
  },
  {
    id: 4,
    nome: 'Cama Pet Soft',
    marca: 'Petmax',
    categoria: 'Camas',
    tipo: 'Gato',
    cor: 'Cinza',
    opcao: 'Médio',
    preco: 99.90,
    imagem: 'https://via.placeholder.com/120x120?text=Cama',
    descricao: 'Cama confortável para gatos, tamanho médio.'
  },
  {
    id: 5,
    nome: 'Comedouro Duplo Inox',
    marca: 'Chalesco',
    categoria: 'Comedouros',
    tipo: 'Cachorro',
    cor: 'Prata',
    opcao: 'Único',
    preco: 49.90,
    imagem: 'https://via.placeholder.com/120x120?text=Comedouro',
    descricao: 'Comedouro duplo em inox para cães.'
  }
])

const produtosFiltrados = ref([...produtos.value])
const termoBuscaGlobal = inject('termoBuscaGlobal')
const filtrosAtuais = ref({ categorias: [], marcas: [], tipos: [], cores: [], opcoes: [], busca: {}, ordenacao: '' })
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
  if (filtros.cores.length) lista = lista.filter(p => filtros.cores.includes(p.cor))
  if (filtros.opcoes.length) lista = lista.filter(p => filtros.opcoes.includes(p.opcao))
  if (filtros.busca.categoria) lista = lista.filter(p => p.categoria.toLowerCase().includes(filtros.busca.categoria.toLowerCase()))
  if (filtros.busca.marca) lista = lista.filter(p => p.marca.toLowerCase().includes(filtros.busca.marca.toLowerCase()))
  if (filtros.busca.tipo) lista = lista.filter(p => p.tipo && p.tipo.toLowerCase().includes(filtros.busca.tipo.toLowerCase()))
  if (filtros.busca.cor) lista = lista.filter(p => p.cor && p.cor.toLowerCase().includes(filtros.busca.cor.toLowerCase()))
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
  <div class="pets-view">
    <Header v-model="termoBusca" :onAbrirCarrinho="props.abrirCarrinho" />
    <div class="conteudo">
      <aside class="filtro-lateral">
        <PetsFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
      </aside>
      <main class="produtos-area">
        <ProdutosList :produtos="produtosFiltrados" :adicionar-ao-carrinho="props.adicionarAoCarrinho" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.pets-view {
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
