<script setup>
import { ref } from 'vue'
const props = defineProps({ produtos: Array })

const produtoSelecionado = ref(null)
const modalAberto = ref(false)

function abrirModal(produto) {
  produtoSelecionado.value = produto
  modalAberto.value = true
}
function fecharModal() {
  modalAberto.value = false
  produtoSelecionado.value = null
}
</script>

<template>
  <div class="produtos-list">
    <div v-for="produto in props.produtos" :key="produto.id" class="produto-card">
      <img :src="produto.imagem" :alt="produto.nome" class="produto-img" />
      <div class="produto-info">
        <h2 class="produto-nome">{{ produto.nome }}</h2>
        <p class="produto-marca">Marca: {{ produto.marca }}</p>
        <p class="produto-descricao">{{ produto.descricao || 'Descrição do produto.' }}</p>
        <div class="produto-preco">R$ {{ produto.preco.toFixed(2) }}</div>
        <button class="btn-comprar" @click="abrirModal(produto)">Comprar</button>
      </div>
    </div>
    <div v-if="!props.produtos.length" class="nenhum-produto">Nenhum produto encontrado.</div>
  </div>

  <div v-if="modalAberto && produtoSelecionado" class="modal-produto-ml">
    <div class="modal-ml-conteudo">
      <button class="fechar-modal-ml" @click="fecharModal">&times;</button>
      <div class="ml-flex">
        <div class="ml-imgs">
          <img :src="produtoSelecionado.imagem" :alt="produtoSelecionado.nome" class="ml-img-grande" />
        </div>
        <div class="ml-info">
          <h2 class="ml-nome">{{ produtoSelecionado.nome }}</h2>
          <p class="ml-marca">Marca: {{ produtoSelecionado.marca }}</p>
          <p v-if="produtoSelecionado.categoria"><b>Categoria:</b> {{ produtoSelecionado.categoria }}</p>
          <p v-if="produtoSelecionado.tipo"><b>Tipo:</b> {{ produtoSelecionado.tipo }}</p>
          <p v-if="produtoSelecionado.peso"><b>Peso:</b> {{ produtoSelecionado.peso }}</p>
          <p v-if="produtoSelecionado.opcao"><b>Opção:</b> {{ produtoSelecionado.opcao }}</p>
          <p v-if="produtoSelecionado.cor"><b>Cor:</b> {{ produtoSelecionado.cor }}</p>
          <p v-if="produtoSelecionado.volume"><b>Volume:</b> {{ produtoSelecionado.volume }}</p>
          <div class="ml-preco">R$ {{ produtoSelecionado.preco.toFixed(2) }}</div>
          <button class="ml-btn-comprar">Comprar agora</button>
          <p class="ml-descricao">{{ produtoSelecionado.descricao }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.produtos-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
  width: 100%;
  padding: 6px;
}
.produto-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px #0002;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 340px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.produto-card:hover {
  box-shadow: 0 8px 32px #f4511e33;
  transform: translateY(-2px) scale(1.03);
}
.produto-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 16px;
  border-radius: 12px;
  background: #f3f6fa;
}
.produto-info {
  text-align: center;
  width: 100%;
}
.produto-nome {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #f4511e;
}
.produto-marca {
  font-size: 1rem;
  color: #388e3c;
  margin-bottom: 6px;
  font-weight: 500;
}
.produto-descricao {
  font-size: 0.97rem;
  color: #666;
  margin-bottom: 12px;
}
.produto-preco {
  font-size: 1.22rem;
  font-weight: bold;
  color: #388e3c;
  margin-bottom: 16px;
}
.btn-comprar {
  background: linear-gradient(90deg, #f4511e 60%, #ff9800 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 32px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #f4511e22;
  transition: background 0.2s, transform 0.2s;
}
.btn-comprar:hover {
  background: linear-gradient(90deg, #d84315 60%, #f59e0b 100%);
  transform: scale(1.05);
}
.nenhum-produto {
  grid-column: 1/-1;
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  margin-top: 32px;
}
.modal-produto-ml {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-ml-conteudo {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px #0003;
  padding: 0;
  min-width: 600px;
  max-width: 98vw;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
}
.fechar-modal-ml {
  position: absolute;
  top: 18px;
  right: 28px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #f4511e;
  cursor: pointer;
  z-index: 10;
}
.ml-flex {
  display: flex;
  flex-direction: row;
  gap: 32px;
  padding: 38px 38px 28px 38px;
}
.ml-imgs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 260px;
  max-width: 340px;
}
.ml-img-grande {
  width: 320px;
  height: 320px;
  object-fit: contain;
  border-radius: 12px;
  background: #f3f6fa;
  box-shadow: 0 2px 12px #0001;
}
.ml-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  min-width: 260px;
}
.ml-nome {
  font-size: 1.35rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}
.ml-marca {
  font-size: 1.08rem;
  color: #388e3c;
  margin-bottom: 4px;
}
.ml-preco {
  font-size: 1.55rem;
  font-weight: bold;
  color: #388e3c;
  margin: 18px 0 12px 0;
}
.ml-btn-comprar {
  background: linear-gradient(90deg, #f4511e 60%, #ff9800 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 12px 38px;
  font-size: 1.12rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #f4511e22;
  transition: background 0.2s, transform 0.2s;
  margin-bottom: 18px;
}
.ml-btn-comprar:hover {
  background: linear-gradient(90deg, #d84315 60%, #f59e0b 100%);
  transform: scale(1.05);
}
.ml-descricao {
  color: #444;
  font-size: 1.08rem;
  margin-top: 10px;
}
@media (max-width: 900px) {
  .modal-ml-conteudo {
    min-width: 0;
    max-width: 99vw;
  }
  .ml-flex {
    flex-direction: column;
    gap: 18px;
    padding: 18px 8vw 18px 8vw;
  }
  .ml-img-grande {
    width: 98vw;
    height: 220px;
    max-width: 98vw;
  }
}
</style>
