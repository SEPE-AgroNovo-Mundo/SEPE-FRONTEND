<script setup>
import { ref, watch, computed } from 'vue'
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits(['filtrar'])
const props = defineProps({ produtos: Array })

const ordenacao = ref('Relevância')
const categoriaBusca = ref('')
const marcaBusca = ref('')
const tipoBusca = ref('')
const pesoBusca = ref('')
const opcaoBusca = ref('')

const categorias = ref([
  { nome: 'Cachorro' },
  { nome: 'Gatos' }
])
const marcas = ref([
  'Farmina', 'Upper', 'Neovia', 'GMP PET', 'Organnact'
])
const tipos = ref([
  'Adulto', 'Filhote'
])
const pesos = ref([
  '10.1 Kg', '7.5 Kg', '20 Kg', '1.5 Kg'
])
const opcoes = ref([
  '1 Unidade', '3 Unidades', 'Fardo Com 12 Unidades', '2 Unidades'
])

const categoriasSelecionadas = ref([])
const marcasSelecionadas = ref([])
const tiposSelecionados = ref([])
const pesosSelecionados = ref([])
const opcoesSelecionadas = ref([])

const categoriasContagem = computed(() => {
  const contagem = {}
  categorias.value.forEach(cat => {
    contagem[cat.nome] = props.produtos.filter(p => p.categoria === cat.nome).length
  })
  return contagem
})
const marcasContagem = computed(() => {
  const contagem = {}
  marcas.value.forEach(marca => {
    contagem[marca] = props.produtos.filter(p => p.marca === marca).length
  })
  return contagem
})
const tiposContagem = computed(() => {
  const contagem = {}
  tipos.value.forEach(tipo => {
    contagem[tipo] = props.produtos.filter(p => p.tipo === tipo).length
  })
  return contagem
})

watch([
  ordenacao,
  categoriasSelecionadas,
  marcasSelecionadas,
  tiposSelecionados,
  pesosSelecionados,
  opcoesSelecionadas,
  categoriaBusca,
  marcaBusca,
  tipoBusca,
  pesoBusca,
  opcaoBusca
], () => {
  emit('filtrar', {
    ordenacao: ordenacao.value,
    categorias: categoriasSelecionadas.value,
    marcas: marcasSelecionadas.value,
    tipos: tiposSelecionados.value,
    pesos: pesosSelecionados.value,
    opcoes: opcoesSelecionadas.value,
    busca: {
      categoria: categoriaBusca.value,
      marca: marcaBusca.value,
      tipo: tipoBusca.value,
      peso: pesoBusca.value,
      opcao: opcaoBusca.value
    }
  })
})
</script>

<template>
  <div class="filtro-container">
    <div class="filtro-bloco">
      <h3><span class="filtro-icone">🔀</span> Ordenar</h3>
      <select v-model="ordenacao">
        <option>Relevância</option>
        <option>Menor preço</option>
        <option>Maior preço</option>
      </select>
    </div>
    <div class="filtro-bloco">
      <h3><span class="filtro-icone">📂</span> Categoria</h3>
      <input type="text" v-model="categoriaBusca" placeholder="Buscar categoria..." class="filtro-busca" />
      <div class="filtro-lista">
        <label v-for="cat in categorias.filter(c => c.nome.toLowerCase().includes(categoriaBusca.toLowerCase()))" :key="cat.nome">
          <input type="checkbox" :value="cat.nome" v-model="categoriasSelecionadas" /> {{ cat.nome }} <span class="badge">{{ categoriasContagem[cat.nome] }}</span>
        </label>
      </div>
    </div>
    <div class="filtro-bloco">
      <h3><span class="filtro-icone">🏷️</span> Marca</h3>
      <input type="text" v-model="marcaBusca" placeholder="Buscar marca..." class="filtro-busca" />
      <div class="filtro-lista">
        <label v-for="marca in marcas.filter(m => m.toLowerCase().includes(marcaBusca.toLowerCase()))" :key="marca">
          <input type="checkbox" :value="marca" v-model="marcasSelecionadas" /> {{ marca }} <span class="badge">{{ marcasContagem[marca] }}</span>
        </label>
      </div>
    </div>
    <div class="filtro-bloco">
      <h3><span class="filtro-icone">🐾</span> Tipo de Animal</h3>
      <input type="text" v-model="tipoBusca" placeholder="Buscar tipo..." class="filtro-busca" />
      <div class="filtro-lista">
        <label v-for="tipo in tipos.filter(t => t.toLowerCase().includes(tipoBusca.toLowerCase()))" :key="tipo">
          <input type="checkbox" :value="tipo" v-model="tiposSelecionados" /> {{ tipo }} <span class="badge">{{ tiposContagem[tipo] }}</span>
        </label>
      </div>
    </div>
    <div class="filtro-bloco">
      <h3><span class="filtro-icone">⚖️</span> Peso</h3>
      <input type="text" v-model="pesoBusca" placeholder="Buscar peso..." class="filtro-busca" />
      <div class="filtro-lista">
        <label v-for="peso in pesos.filter(p => p.toLowerCase().includes(pesoBusca.toLowerCase()))" :key="peso">
          <input type="checkbox" :value="peso" v-model="pesosSelecionados" /> {{ peso }}
        </label>
      </div>
    </div>
    <div class="filtro-bloco">
      <h3><span class="filtro-icone">🧩</span> Opção</h3>
      <input type="text" v-model="opcaoBusca" placeholder="Buscar opção..." class="filtro-busca" />
      <div class="filtro-lista">
        <label v-for="opcao in opcoes.filter(o => o.toLowerCase().includes(opcaoBusca.toLowerCase()))" :key="opcao">
          <input type="checkbox" :value="opcao" v-model="opcoesSelecionadas" /> {{ opcao }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filtro-container {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px #0002;
  padding: 24px 18px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.filtro-bloco {
  background: #f3f6fa;
  border-radius: 12px;
  padding: 16px 12px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px #0001;
}
.filtro-bloco h3 {
  font-size: 1.08rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #f4511e;
  display: flex;
  align-items: center;
  gap: 8px;
}
.filtro-icone {
  font-size: 1.2rem;
}
.filtro-busca {
  width: 100%;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 1rem;
  background: #fff;
}
.filtro-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filtro-lista label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  color: #222;
  background: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  box-shadow: 0 1px 4px #0001;
}
.badge {
  background: #f4511e22;
  color: #f4511e;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.88rem;
  margin-left: 8px;
  font-weight: 600;
}
select {
  width: 100%;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #fff;
  margin-bottom: 4px;
}
</style>
