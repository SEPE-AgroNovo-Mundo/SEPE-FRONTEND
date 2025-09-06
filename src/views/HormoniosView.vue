<script setup>
import Header from '@/assets/components/Header.vue'
import HormoniosFiltro from '@/assets/components/HormoniosFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref } from 'vue'

const produtos = ref([
  {
    id: 1,
    nome: 'HCG 5000 UI',
    marca: 'Ourofino',
    categoria: 'Hormônios',
    tipo: 'Bovino',
    volume: '5 ml',
    peso: '5 g',
    opcao: 'Caixa',
    preco: 120.00,
    imagem: 'https://via.placeholder.com/120x120?text=HCG',
    descricao: 'Hormônio para indução de ovulação em bovinos.'
  },
  {
    id: 2,
    nome: 'Ocitocina 10 ml',
    marca: 'Zoetis',
    categoria: 'Hormônios',
    tipo: 'Equino',
    volume: '10 ml',
    peso: '10 g',
    opcao: 'Frasco',
    preco: 85.50,
    imagem: 'https://via.placeholder.com/120x120?text=Ocitocina',
    descricao: 'Hormônio para indução de parto em equinos.'
  },
  {
    id: 3,
    nome: 'Progesterona 20 mg',
    marca: 'Calbos',
    categoria: 'Hormônios',
    tipo: 'Suíno',
    volume: '20 ml',
    peso: '20 g',
    opcao: 'Ampola',
    preco: 99.90,
    imagem: 'https://via.placeholder.com/120x120?text=Progesterona',
    descricao: 'Hormônio para sincronização de cio em suínos.'
  },
  {
    id: 4,
    nome: 'Testosterona 50 mg',
    marca: 'União Química',
    categoria: 'Hormônios',
    tipo: 'Bovino',
    volume: '50 ml',
    peso: '50 g',
    opcao: 'Frasco',
    preco: 150.00,
    imagem: 'https://via.placeholder.com/120x120?text=Testosterona',
    descricao: 'Hormônio para ganho de massa muscular em bovinos.'
  },
  {
    id: 5,
    nome: 'Estrogênio 5 mg',
    marca: 'Ourofino',
    categoria: 'Hormônios',
    tipo: 'Equino',
    volume: '5 ml',
    peso: '5 g',
    opcao: 'Ampola',
    preco: 110.00,
    imagem: 'https://via.placeholder.com/120x120?text=Estrogenio',
    descricao: 'Hormônio para regulação do ciclo reprodutivo em equinos.'
  }
])

const produtosFiltrados = ref([...produtos.value])

function filtrarProdutos(filtros) {
  let lista = produtos.value
  if (filtros.categorias.length) {
    lista = lista.filter(p => filtros.categorias.includes(p.categoria))
  }
  if (filtros.marcas.length) {
    lista = lista.filter(p => filtros.marcas.includes(p.marca))
  }
  if (filtros.tipos.length) {
    lista = lista.filter(p => filtros.tipos.includes(p.tipo))
  }
  if (filtros.volumes.length) {
    lista = lista.filter(p => filtros.volumes.includes(p.volume))
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
  if (filtros.busca.tipo) {
    lista = lista.filter(p => p.tipo && p.tipo.toLowerCase().includes(filtros.busca.tipo.toLowerCase()))
  }
  if (filtros.busca.volume) {
    lista = lista.filter(p => p.volume && p.volume.toLowerCase().includes(filtros.busca.volume.toLowerCase()))
  }
  if (filtros.busca.peso) {
    lista = lista.filter(p => p.peso && p.peso.toLowerCase().includes(filtros.busca.peso.toLowerCase()))
  }
  if (filtros.busca.opcao) {
    lista = lista.filter(p => p.opcao && p.opcao.toLowerCase().includes(filtros.busca.opcao.toLowerCase()))
  }
  if (filtros.ordenacao === 'Menor preço') {
    lista = [...lista].sort((a, b) => a.preco - b.preco)
  } else if (filtros.ordenacao === 'Maior preço') {
    lista = [...lista].sort((a, b) => b.preco - a.preco)
  }
  produtosFiltrados.value = lista
}
</script>

<template>
  <div class="hormonios-view">
    <Header />
    <div class="conteudo">
      <aside class="filtro-lateral">
        <HormoniosFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
      </aside>
      <main class="produtos-area">
        <ProdutosList :produtos="produtosFiltrados" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.hormonios-view {
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
