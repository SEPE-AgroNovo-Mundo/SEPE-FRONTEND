<script setup>
import Header from '@/assets/components/Header.vue'
import MedicaFiltro from '@/assets/components/MedicaFiltro.vue'
import ProdutosList from '@/assets/components/ProdutosList.vue'
import Footer from '@/assets/components/Footer.vue'
import { ref, inject, watch, defineProps, defineEmits } from 'vue'
import VermifugoOurofinoImg from '@/assets/imagens/Vermifugo_Ourofino.jpg'
import Imagem2 from '@/assets/imagens/2.jpg'
import Imagem3 from '@/assets/imagens/3.jpg'
import Imagem4 from '@/assets/imagens/04.jpg'
import Imagem5 from '@/assets/imagens/05.jpg'
import Imagem6 from '@/assets/imagens/06.jpg'
import Imagem7 from '@/assets/imagens/07.jpg'
import Imagem8 from '@/assets/imagens/8.jpg'
import Imagem9 from '@/assets/imagens/9.jpg'
import Imagem10 from '@/assets/imagens/10.jpg'
import Imagem11 from '@/assets/imagens/11.jpg'
import Imagem12 from '@/assets/imagens/12.jpg'
import Imagem13 from '@/assets/imagens/13.jpg'
import Imagem14 from '@/assets/imagens/14.jpg'
import Imagem15 from '@/assets/imagens/15.jpg'

const props = defineProps({ adicionarAoCarrinho: Function, abrirCarrinho: Function, favoritos: Array })
const emit = defineEmits(['toggle-favorito'])

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
    imagem: VermifugoOurofinoImg,
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
    imagem: Imagem2,
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
    imagem: Imagem3,
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
    imagem: Imagem4,
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
    imagem: Imagem5,
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
    imagem: Imagem6,
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
    imagem: Imagem7,
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
    imagem: Imagem8,
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
    imagem: Imagem9,
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
    imagem: Imagem10,
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
    imagem: Imagem11,
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
    imagem: Imagem12,
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
    imagem: Imagem13,
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
    imagem: Imagem14,
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
    imagem: Imagem15,
    descricao: 'Hormônio para equinos. Auxilia no crescimento.'
  },

])

const produtosFiltrados = ref([...produtos.value])
const termoBuscaGlobal = inject('termoBuscaGlobal')

const filtrosAtuais = ref({
  categorias: [],
  marcas: [],
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
  filtrarProdutos({ categorias: [], marcas: [], pesos: [], opcoes: [], busca: {}, ordenacao: '' })
})

function filtrarProdutos(filtros) {
  filtrosAtuais.value = JSON.parse(JSON.stringify(filtros))
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
  // Aplica filtro global do Header
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
  <div class="medicamentos-view">
    <Header v-model="termoBusca" :onAbrirCarrinho="props.abrirCarrinho" />
    <div class="conteudo">
      <aside class="filtro-lateral">
        <button class="btn-toggle-filtro" @click="alternarFiltro">
          {{ filtroAberto ? 'Recolher Filtros ▲' : 'Exibir Filtros ▼' }}
        </button>
        <transition name="fade">
          <div v-show="filtroAberto">
            <MedicaFiltro :produtos="produtos" @filtrar="filtrarProdutos" />
          </div>
        </transition>
      </aside>
      <main class="produtos-area">
        <ProdutosList :produtos="produtosFiltrados" :adicionarAoCarrinho="props.adicionarAoCarrinho" :favoritos="props.favoritos" @toggle-favorito="emit('toggle-favorito', $event)" />
      </main>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.medicamentos-view {
  background: #f3f6fa;
  min-height: 100vh;
}

.conteudo {
  display: flex;
  gap: 20px;
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
