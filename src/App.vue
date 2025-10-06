<script setup>
import { useRouter } from 'vue-router';
import { ref, provide, reactive } from 'vue';
import Carrinho from '@/assets/components/Carrinho.vue';

const router = useRouter();
const termoBuscaGlobal = ref('');
provide('termoBuscaGlobal', termoBuscaGlobal);

const carrinho = reactive([]);
const carrinhoAberto = ref(false);

function fecharCarrinho() {
  carrinhoAberto.value = false;
}
function abrirCarrinho() {
  carrinhoAberto.value = true;
}
function adicionarAoCarrinho(produto, quantidade = 1) {
  const idx = carrinho.findIndex(p => p.id === produto.id);
  if (idx >= 0) {
    carrinho[idx].quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade });
  }
}
function alterarQtd({ produto, delta }) {
  const idx = carrinho.findIndex(p => p.id === produto.id);
  if (idx >= 0) {
    carrinho[idx].quantidade += delta;
    if (carrinho[idx].quantidade < 1) carrinho[idx].quantidade = 1;
  }
}
function removerDoCarrinho(produto) {
  const idx = carrinho.findIndex(p => p.id === produto.id);
  if (idx >= 0) carrinho.splice(idx, 1);
}

function openGoogleMaps() {
  window.open('https://maps.app.goo.gl/AoXwekmE8mBYcWsg6', '_blank');
}
function oswhats() {
  window.open('https://wa.link/h475ec', '_blank');
}

function goToLogin() {
  router.push('/medicamentos');
}

const favoritos = reactive([])

// Carregar favoritos do localStorage ao iniciar
if (typeof window !== 'undefined') {
  const favSalvos = localStorage.getItem('favoritos')
  if (favSalvos) {
    try {
      const favs = JSON.parse(favSalvos)
      favoritos.splice(0, favoritos.length, ...favs)
    } catch {
      // Ignorar erro ao fazer parse dos favoritos salvos
    }
  }
}

function salvarFavoritos() {
  localStorage.setItem('favoritos', JSON.stringify(favoritos))
}

function toggleFavorito(produto) {
  const idx = favoritos.findIndex(p => p.id === produto.id)
  if (idx >= 0) {
    favoritos.splice(idx, 1)
  } else {
    favoritos.push(produto)
  }
  salvarFavoritos()
}

</script>

<template>
  <div>
    <header>
      <!-- Removido o botão de favoritos -->
    </header>
    <router-view v-slot="{ Component }">
      <component :is="Component"
        :adicionar-ao-carrinho="adicionarAoCarrinho"
        :abrir-carrinho="abrirCarrinho"
        :favoritos="favoritos"
        @toggle-favorito="toggleFavorito"
      />
    </router-view>
    <Carrinho v-if="carrinhoAberto" :produtos="carrinho" @fechar="fecharCarrinho" @alterarQtd="alterarQtd"
      @remover="removerDoCarrinho" />
    <!-- Removido o modal de favoritos -->
    <div v-if="$route.path === '/'" class="background">
      <div class="overlay">
        <div class="container">
          <img src="@/assets/imagens/logo.png" alt="Santory Pizzaria" class="logo" />
          <h1 class="slogan">Seja Bem-Vindo(a)!</h1>
          <div class="buttons">
            <button class="btn orange" @click="goToLogin">🛒 Ver nosso catalogo!</button>
            <button class="btn dark" @click="openGoogleMaps">📍 Como Chegar</button>
            <button class="btn green" @click="oswhats">💬 Whatsapp</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (max-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.background {
  background-image: url('@/assets/imagens/fundo.png');
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;
}

.container {
  text-align: center;
  color: white;
  padding: 2rem;
  border-radius: 10px;
  z-index: 3;
  margin-top: 6vh;
}

.logo {
  width: 160px;
  margin-bottom: 1rem;
}

.slogan {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.btn.orange {
  background-color: #f59e0b;
  color: white;
}

.btn.orange:hover {
  background-color: #d97706;
}

.btn.dark {
  background-color: #1f2937;
  color: white;
}

.btn.dark:hover {
  background-color: #374151;
}

.btn.green {
  background-color: #10b981;
  color: white;
}

.btn.green:hover {
  background-color: #059669;
}

.btn-favoritos {
  position: absolute;
  top: 16px;
  right: 24px;
  background: #fff;
  color: #e11d48;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s;
}
.btn-favoritos:hover {
  background: #f3f4f6;
}
.favoritos-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.favoritos-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}
.favoritos-content .fechar {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #e11d48;
}
</style>

<style>
html,
body,
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
