<script setup>
import { useRouter } from 'vue-router';
import { ref, provide, reactive, onMounted, watch } from 'vue';
import Carrinho from '@/assets/components/Carrinho.vue';
import { produtos as produtosForum } from '@/assets/produtos.js';
// import { produtos } from '@/assets/produtos.js';

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

const showForum = ref(false)
const abrirProdutos = ref(false)
const novaMensagem = ref('')
const mensagens = ref([
  // Exemplo inicial
  { id: 1, texto: 'Bem-vindo ao fórum!', eu: false }
])
const produtosForumRef = ref(produtosForum)
const produtosLocal = ref([
  // Exemplo de produtos (pode ser substituído por produtos reais do sistema)
  { id: 1, nome: 'Produto Exemplo', preco: '99,90', imagem: new URL('@/assets/imagens/logo.png', import.meta.url).href }
])

const FORUM_KEY = 'forum_mensagens'

function salvarMensagens() {
  localStorage.setItem(FORUM_KEY, JSON.stringify(mensagens.value))
}

function carregarMensagens() {
  const salvas = localStorage.getItem(FORUM_KEY)
  if (salvas) {
    try {
      mensagens.value = JSON.parse(salvas)
    } catch {
      // Ignorar erro ao fazer parse das mensagens salvas
    }
  }
}

onMounted(async () => {
  carregarMensagens()
  // Carrega todos os produtos das views de forma assíncrona
  const all = []
  const viewFiles = [
    () => import('./views/MedicamentosView.vue'),
    () => import('./views/FerragensView.vue'),
    () => import('./views/HormoniosView.vue'),
    () => import('./views/RacoesView.vue'),
    () => import('./views/DedetizacaoView.vue'),
    () => import('./views/PetsView.vue')
  ]
  for (const loadView of viewFiles) {
    try {
      const view = await loadView()
      if (view.produtos && Array.isArray(view.produtos.value)) {
        all.push(...view.produtos.value)
      }
    } catch {
      // Ignorar erro ao importar view
    }
  }
  produtosLocal.value = all.filter(p => p && p.nome && p.imagem)
  produtosForum.value = produtosLocal.value
})

watch(mensagens, salvarMensagens, { deep: true })

function enviarMensagem() {
  if (novaMensagem.value.trim()) {
    mensagens.value.push({ id: Date.now(), texto: novaMensagem.value, eu: true })
    novaMensagem.value = ''
    abrirProdutos.value = false
  }
}
function enviarProduto(produto) {
  mensagens.value.push({ id: Date.now(), produto, eu: true })
  abrirProdutos.value = false
}
</script>

<template>
  <div>
    <header>
      <!-- Removido o botão de favoritos -->
    </header>
    <router-view v-slot="{ Component }">
      <component :is="Component" :adicionar-ao-carrinho="adicionarAoCarrinho" :abrir-carrinho="abrirCarrinho"
        :favoritos="favoritos" @toggle-favorito="toggleFavorito" />
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
    <div v-if="showForum" class="forum-modal-bg" @click.self="showForum = false">
      <div class="forum-modal">
        <div class="forum-header">
          <span>Fórum de Mensagens</span>
          <button class="forum-close" @click="showForum = false">×</button>
        </div>
        <div class="forum-mensagens">
          <div v-for="msg in mensagens" :key="msg.id" :class="['forum-msg', msg.eu ? 'eu' : 'outro']">
            <div v-if="msg.produto" class="forum-produto-msg">
              <img :src="msg.produto.imagem" class="forum-produto-img" />
              <div>
                <div class="forum-produto-nome">{{ msg.produto.nome }}</div>
                <div class="forum-produto-preco">R$ {{ msg.produto.preco }}</div>
              </div>
            </div>
            <div v-if="msg.texto">{{ msg.texto }}</div>
          </div>
        </div>
        <div class="forum-input-area">
          <input v-model="novaMensagem" @keyup.enter="enviarMensagem" placeholder="Digite sua mensagem..." />
          <button @click="enviarMensagem">Enviar</button>
          <button class="forum-produto-btn" @click="abrirProdutos = !abrirProdutos">📦</button>
        </div>
        <div v-if="abrirProdutos" class="forum-produtos-lista">
          <div v-for="produto in produtosForumRef" :key="produto.id" class="forum-produto-item"
            @click="enviarProduto(produto)">
            <img :src="produto.imagem" class="forum-produto-img" />
            <div>
              <div class="forum-produto-nome">{{ produto.nome }}</div>
              <div class="forum-produto-preco">R$ {{ produto.preco }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="forum-bola" @click="showForum = true">
      💬
    </button>
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: background 0.2s;
}

.btn-favoritos:hover {
  background: #f3f4f6;
}

.favoritos-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
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

.forum-bola {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f4511e;
  color: #fff;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px #0003;
  border: none;
  cursor: pointer;
  z-index: 3000;
  transition: background 0.2s;
}

.forum-bola:hover {
  background: #d84315;
}

.forum-modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 3100;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.forum-modal {
  width: 370px;
  max-width: 98vw;
  background: #fff;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 4px 32px #0005;
  margin: 0 32px 32px 0;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: hidden;
}

.forum-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 10px 18px;
  font-size: 1.18rem;
  font-weight: 700;
  color: #f4511e;
  border-bottom: 1px solid #f3f6fa;
}

.forum-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.forum-mensagens {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.forum-msg {
  max-width: 80%;
  padding: 8px 14px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px #0001;
  font-size: 1rem;
  align-self: flex-start;
  word-break: break-word;
}

.forum-msg.eu {
  background: #f4511e22;
  align-self: flex-end;
}

.forum-produto-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.forum-produto-img {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  object-fit: cover;
  background: #eee;
}

.forum-produto-nome {
  font-weight: 700;
  font-size: 1rem;
}

.forum-produto-preco {
  font-size: 0.98rem;
  color: #388e3c;
}

.forum-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px 16px 2px;
  border-top: 1px solid #f3f6fa;
  background: #fff;
}

.forum-input-area input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #f3f6fa;
}

.forum-input-area button {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.forum-input-area button:hover {
  background: #d84315;
}

.forum-produto-btn {
  background: #fff !important;
  color: #f4511e !important;
  border: 1px solid #f4511e !important;
  padding: 8px 10px !important;
  font-size: 1.2rem !important;
  margin-left: 2px;
}

.forum-produtos-lista {
  max-height: 180px;
  overflow-y: auto;
  background: #f9f9f9;
  border-top: 1px solid #eee;
  padding: 8px 0 8px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.forum-produto-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  cursor: pointer;
  transition: background 0.2s;
}

.forum-produto-item:hover {
  background: #f4511e22;
}

@media (max-width: 600px) {
  .forum-bola {
    width: 48px;
    height: 48px;
    font-size: 1.4rem;
    bottom: 16px;
    right: 16px;
  }

  .forum-modal {
    width: 98vw;
    margin: 0 1vw 12px 0;
    border-radius: 16px 16px 0 0;
    min-width: unset;
    max-width: 99vw;
  }

  .forum-header {
    padding: 10px 8px 8px 8px;
    font-size: 1rem;
  }

  .forum-mensagens {
    padding: 8px 8px;
    font-size: 0.98rem;
  }

  .forum-input-area {
    padding: 8px 8px 10px 8px;
    gap: 4px;
  }

  .forum-produto-img {
    width: 28px;
    height: 28px;
  }

  .forum-produto-item {
    padding: 6px 8px;
    gap: 6px;
  }
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
