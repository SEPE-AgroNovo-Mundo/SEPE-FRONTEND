<template>
  <div class="medicamentos-view">
    <Header />
    <div class="conteudo">
      <aside class="filtro-lateral">
        <MedicaFiltro @filtrar="filtrarProdutos" />
      </aside>
      <main class="produtos-area">
        <ProdutosList :produtos="produtosFiltrados" />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from '@/assets/components/Header.vue'
import MedicaFiltro from '@/assets/components/MedicaFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import { ref } from 'vue'

// Exemplo de produtos
const produtos = ref([
  {
    id: 1,
    nome: 'Vermífugo Pet',
    marca: 'Ourofino',
    categoria: 'Anti Parasitários',
    peso: '10 G',
    opcao: 'Único',
    preco: 29.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+1',
    descricao: 'Vermífugo para pets. Elimina vermes e protege a saúde do seu animal.'
  },
  {
    id: 2,
    nome: 'Antibiótico Bovino',
    marca: 'Zoetis',
    categoria: 'Antibióticos E Anti Microbianos',
    peso: '100 G',
    opcao: 'Caixa Com 1 Unidade',
    preco: 49.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+2',
    descricao: 'Antibiótico para bovinos. Tratamento eficaz contra infecções.'
  },
  {
    id: 3,
    nome: 'Suplemento Equino',
    marca: 'União Química',
    categoria: 'Suplementos',
    peso: '1 Kg',
    opcao: '20 Unidades',
    preco: 99.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+3',
    descricao: 'Suplemento vitamínico para equinos. Fortalece e melhora o desempenho.'
  },
  {
    id: 4,
    nome: 'Anti Alérgico Canino',
    marca: 'Calbos',
    categoria: 'Anti Alérgicos E Anti Inflamatórios',
    peso: '30 G',
    opcao: 'Único',
    preco: 19.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+4',
    descricao: 'Anti alérgico para cães. Alivia sintomas de alergia.'
  },
  {
    id: 5,
    nome: 'Hormônio Bovino',
    marca: 'Ourofino',
    categoria: 'Hormônios',
    peso: '50 G',
    opcao: 'Caixa Com 3 Unidades',
    preco: 79.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+5',
    descricao: 'Hormônio para bovinos. Auxilia no crescimento e reprodução.'
  },
  {
    id: 6,
    nome: 'Suplemento Pet',
    marca: 'Zoetis',
    categoria: 'Suplementos',
    peso: '100 G',
    opcao: '20 Comprimidos',
    preco: 39.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+6',
    descricao: 'Suplemento para pets. Fortalece o sistema imunológico.'
  },
  {
    id: 7,
    nome: 'Antibiótico Pet',
    marca: 'União Química',
    categoria: 'Antibióticos E Anti Microbianos',
    peso: '10 G',
    opcao: 'Único',
    preco: 24.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+7',
    descricao: 'Antibiótico para pets. Combate infecções bacterianas.'
  },
  {
    id: 8,
    nome: 'Vermífugo Bovino',
    marca: 'Calbos',
    categoria: 'Anti Parasitários',
    peso: '1 Kg',
    opcao: 'Caixa Com 1 Unidade',
    preco: 59.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+8',
    descricao: 'Vermífugo para bovinos. Protege contra vermes intestinais.'
  },
  {
    id: 9,
    nome: 'Anti Inflamatório Equino',
    marca: 'Ourofino',
    categoria: 'Anti Alérgicos E Anti Inflamatórios',
    peso: '30 G',
    opcao: 'Único',
    preco: 34.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+9',
    descricao: 'Anti inflamatório para equinos. Reduz inflamações e dores.'
  },
  {
    id: 10,
    nome: 'Hormônio Pet',
    marca: 'Zoetis',
    categoria: 'Hormônios',
    peso: '10 G',
    opcao: '20 Unidades',
    preco: 89.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+10',
    descricao: 'Hormônio para pets. Auxilia no desenvolvimento saudável.'
  },
  {
    id: 11,
    nome: 'Suplemento Bovino',
    marca: 'União Química',
    categoria: 'Suplementos',
    peso: '1 Kg',
    opcao: 'Caixa Com 3 Unidades',
    preco: 109.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+11',
    descricao: 'Suplemento para bovinos. Melhora a produção de leite.'
  },
  {
    id: 12,
    nome: 'Antibiótico Equino',
    marca: 'Calbos',
    categoria: 'Antibióticos E Anti Microbianos',
    peso: '50 G',
    opcao: 'Único',
    preco: 54.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+12',
    descricao: 'Antibiótico para equinos. Tratamento de infecções.'
  },
  {
    id: 13,
    nome: 'Vermífugo Equino',
    marca: 'Ourofino',
    categoria: 'Anti Parasitários',
    peso: '100 G',
    opcao: '20 Comprimidos',
    preco: 44.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+13',
    descricao: 'Vermífugo para equinos. Elimina vermes e parasitas.'
  },
  {
    id: 14,
    nome: 'Anti Alérgico Bovino',
    marca: 'Zoetis',
    categoria: 'Anti Alérgicos E Anti Inflamatórios',
    peso: '1 Kg',
    opcao: 'Caixa Com 1 Unidade',
    preco: 29.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+14',
    descricao: 'Anti alérgico para bovinos. Alivia sintomas de alergia.'
  },
  {
    id: 15,
    nome: 'Hormônio Equino',
    marca: 'União Química',
    categoria: 'Hormônios',
    peso: '30 G',
    opcao: 'Único',
    preco: 99.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+15',
    descricao: 'Hormônio para equinos. Auxilia no crescimento.'
  },
  {
    id: 16,
    nome: 'Suplemento Canino',
    marca: 'Calbos',
    categoria: 'Suplementos',
    peso: '10 G',
    opcao: '20 Unidades',
    preco: 24.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+16',
    descricao: 'Suplemento para cães. Fortalece ossos e dentes.'
  },
  {
    id: 17,
    nome: 'Antibiótico Canino',
    marca: 'Ourofino',
    categoria: 'Antibióticos E Anti Microbianos',
    peso: '100 G',
    opcao: 'Caixa Com 3 Unidades',
    preco: 39.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+17',
    descricao: 'Antibiótico para cães. Combate infecções.'
  },
  {
    id: 18,
    nome: 'Vermífugo Canino',
    marca: 'Zoetis',
    categoria: 'Anti Parasitários',
    peso: '1 Kg',
    opcao: 'Único',
    preco: 49.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+18',
    descricao: 'Vermífugo para cães. Elimina vermes intestinais.'
  },
  {
    id: 19,
    nome: 'Anti Inflamatório Pet',
    marca: 'União Química',
    categoria: 'Anti Alérgicos E Anti Inflamatórios',
    peso: '30 G',
    opcao: '20 Comprimidos',
    preco: 34.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+19',
    descricao: 'Anti inflamatório para pets. Reduz inflamações.'
  },
  {
    id: 20,
    nome: 'Hormônio Canino',
    marca: 'Calbos',
    categoria: 'Hormônios',
    peso: '50 G',
    opcao: 'Caixa Com 1 Unidade',
    preco: 79.90,
    imagem: 'https://via.placeholder.com/120x120?text=Produto+20',
    descricao: 'Hormônio para cães. Auxilia no desenvolvimento.'
  }

])

const produtosFiltrados = ref([...produtos.value])

function filtrarProdutos(filtros) {
  let lista = produtos.value
  // Filtro por categoria
  if (filtros.categorias.length) {
    lista = lista.filter(p => filtros.categorias.includes(p.categoria))
  }
  // Filtro por marca
  if (filtros.marcas.length) {
    lista = lista.filter(p => filtros.marcas.includes(p.marca))
  }
  // Filtro por peso
  if (filtros.pesos.length) {
    lista = lista.filter(p => filtros.pesos.includes(p.peso))
  }
  // Filtro por opção
  if (filtros.opcoes.length) {
    lista = lista.filter(p => filtros.opcoes.includes(p.opcao))
  }
  // Busca por nome
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
  // Ordenação
  if (filtros.ordenacao === 'Menor preço') {
    lista = [...lista].sort((a, b) => a.preco - b.preco)
  } else if (filtros.ordenacao === 'Maior preço') {
    lista = [...lista].sort((a, b) => b.preco - a.preco)
  }
  produtosFiltrados.value = lista
}
</script>

<style scoped>
.medicamentos-view {
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
