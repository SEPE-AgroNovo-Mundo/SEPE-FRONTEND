<template>
  <button class="seta-voltar" @click="$router.push('/medicamentos')" aria-label="Voltar para o menu">
    <img src="@/assets/imagens/seta-preta.png" alt="Voltar" />
  </button>
  <div class="favoritos-view">
    <h1>Meus Favoritos</h1>
    <div v-if="favoritos.length === 0" class="vazio">Nenhum produto favoritado ainda.</div>
    <div v-else class="produtos-list">
      <div v-for="produto in favoritos" :key="produto.id" class="produto-card">
        <button class="btn-favorito" @click="removerFavorito(produto)" aria-label="Remover dos favoritos">
          <img src="@/assets/imagens/favorito-cheio.png" alt="Remover dos favoritos" />
        </button>
        <img :src="produto.imagem" :alt="produto.nome" class="produto-img" />
        <div class="produto-info">
          <h2>{{ produto.nome }}</h2>
          <p v-if="produto.marca"><b>Marca:</b> {{ produto.marca }}</p>
          <p v-if="produto.preco"><b>Preço:</b> R$ {{ produto.preco.toFixed(2) }}</p>
          <button class="btn-comprar" @click="comprar(produto)">Comprar</button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showAlert" :class="['alerta-top', alertType]">
        {{ alertMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
const props = defineProps({ adicionarAoCarrinho: Function })
const favoritos = ref([])

const showAlert = ref(false)
const alertMsg = ref('')
const alertType = ref('') // 'success' ou 'info'

function exibirAlerta(msg, tipo = 'success') {
  alertMsg.value = msg
  alertType.value = tipo
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 2200)
}

onMounted(() => {
  const fav = localStorage.getItem('favoritos')
  favoritos.value = fav ? JSON.parse(fav) : []
})

function removerFavorito(produto) {
  favoritos.value = favoritos.value.filter(f => f.id !== produto.id)
  localStorage.setItem('favoritos', JSON.stringify(favoritos.value))
  exibirAlerta('Item removido dos favoritos!', 'info')
}

function comprar(produto) {
  if (props.adicionarAoCarrinho) {
    props.adicionarAoCarrinho(produto, 1)
    exibirAlerta('Item adicionado ao carrinho!')
  }
}
</script>

<style scoped>
.favoritos-view {
  max-width: 1100px;
  margin: 64px auto 32px auto;
  padding: 40px 32px 40px 32px;
  background: linear-gradient(120deg, #fff 80%, #fff7ed 100%);
  border-radius: 28px;
  box-shadow: 0 12px 40px #fbbf2444;
  position: relative;
  min-height: 60vh;
}
.seta-voltar {
  position: fixed;
  top: 36px;
  left: 36px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  box-shadow: 0 6px 20px #fbbf2444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  z-index: 100;
}
.seta-voltar:hover {
  background: #fff7ed;
  box-shadow: 0 12px 32px #fbbf2422;
  transform: scale(1.08);
}
.seta-voltar img {
  width: 30px;
  height: 30px;
}
.favoritos-view h1 {
  color: #f59e0b;
  margin-bottom: 40px;
  text-align: center;
  margin-top: 0;
  font-size: 2.3rem;
  letter-spacing: 1.5px;
  font-weight: 800;
  text-shadow: 0 2px 8px #fff7ed;
}
.vazio {
  text-align: center;
  color: #f59e0b;
  font-size: 1.3rem;
  margin: 70px 0;
}
.produtos-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 40px;
}
.produto-card {
  background: linear-gradient(135deg, #fff 70%, #fff7ed 100%);
  border-radius: 18px;
  box-shadow: 0 4px 18px #fbbf2422;
  padding: 28px 16px 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
  border: 2px solid #fff7ed;
  position: relative;
}
.produto-card:hover {
  box-shadow: 0 12px 32px #fbbf2422;
  transform: translateY(-6px) scale(1.04);
  border: 2px solid #f59e0b44;
}
.produto-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 18px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 10px #fbbf2422;
}
.produto-info {
  text-align: center;
}
.produto-info h2 {
  font-size: 1.22rem;
  margin: 0 0 12px 0;
  color: #f59e0b;
  font-weight: 700;
}
.produto-info p {
  margin: 0 0 8px 0;
  color: #b45309;
  font-size: 1.08rem;
}
.btn-favorito {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 8px #fbbf2422;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  padding: 0;
}
.btn-favorito:hover {
  background: #fff7ed;
  box-shadow: 0 6px 18px #fbbf2422;
  transform: scale(1.08);
}
.btn-favorito img {
  width: 24px;
  height: 24px;
}
.btn-comprar {
  margin-top: 14px;
  background: linear-gradient(90deg, #f59e0b 60%, #fbbf24 100%);
  color: #fff;
  border: none;
  border-radius: 22px;
  padding: 10px 32px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #fbbf2422;
  transition: background 0.2s, transform 0.2s;
  letter-spacing: 1px;
}
.btn-comprar:hover {
  background: linear-gradient(90deg, #b45309 60%, #f59e0b 100%);
  transform: scale(1.04);
}
.alerta-top {
  position: fixed;
  top: 32px;
  right: 32px;
  background: #fff;
  color: #f59e0b;
  border: 2px solid #fbbf24;
  border-radius: 16px;
  box-shadow: 0 4px 24px #fbbf2422;
  padding: 18px 38px 16px 38px;
  font-size: 1.12rem;
  font-weight: 700;
  z-index: 3000;
  display: flex;
  align-items: center;
  animation: fadeInRight 0.3s;
  min-width: 220px;
  justify-content: center;
}
.alerta-top.info {
  color: #b45309;
  border-color: #ffe6c7;
  background: #fff7ed;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes fadeInRight {
  from { opacity: 0; right: 0; }
  to { opacity: 1; right: 32px; }
}
@media (max-width: 900px) {
  .favoritos-view {
    padding: 14px 2vw 24px 2vw;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    max-width: 100vw;
  }
  .seta-voltar {
    top: 10px;
    left: 10px;
    width: 38px;
    height: 38px;
  }
  .seta-voltar img {
    width: 20px;
    height: 20px;
  }
  .produtos-list {
    gap: 16px;
    grid-template-columns: 1fr 1fr;
  }
  .produto-card {
    padding: 12px 4px;
  }
}
@media (max-width: 600px) {
  .favoritos-view {
    padding: 8px 2px 24px 2px;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    max-width: 100vw;
  }
  .seta-voltar {
    top: 8px;
    left: 8px;
    width: 32px;
    height: 32px;
  }
  .seta-voltar img {
    width: 16px;
    height: 16px;
  }
  .produtos-list {
    gap: 8px;
    grid-template-columns: 1fr;
  }
  .produto-card {
    padding: 8px 2px;
  }
}
</style>
