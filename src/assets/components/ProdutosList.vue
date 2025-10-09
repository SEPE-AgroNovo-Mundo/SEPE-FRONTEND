<script setup>
import { ref, computed } from 'vue'
import favoritoCheioImg from '@/assets/imagens/favorito-cheio.png'
import favoritoVazioImg from '@/assets/imagens/favorito.png'
const emit = defineEmits(['toggle-favorito'])
const props = defineProps({ produtos: Array, adicionarAoCarrinho: Function, expandido: Boolean, favoritos: Array })

const produtoSelecionado = ref(null)
const modalAberto = ref(false)
const quantidade = ref(1)
const showAlert = ref(false)
const alertMsg = ref('')

const valorTotal = computed(() => {
  if (!produtoSelecionado.value) return 0
  return quantidade.value * produtoSelecionado.value.preco
})


// Feedbacks dinâmicos por produto
const feedbacks = ref([])
const novoFeedback = ref({ usuario: '', nota: 5, comentario: '' })
const feedbackFormAberto = ref(false)
const feedbacksVisiveis = ref(true)

function carregarFeedbacks(id) {
  const salvos = localStorage.getItem('feedbacks_' + id)
  feedbacks.value = salvos ? JSON.parse(salvos) : []
}
function salvarFeedbacks(id) {
  localStorage.setItem('feedbacks_' + id, JSON.stringify(feedbacks.value))
}
function enviarFeedback() {
  if (!novoFeedback.value.usuario || !novoFeedback.value.comentario) return
  feedbacks.value.push({ ...novoFeedback.value })
  salvarFeedbacks(produtoSelecionado.value.id)
  novoFeedback.value = { usuario: usuarioLogado(), nota: 5, comentario: '' }
}

function removerFeedback(idx) {
  // Só permite remover se for o feedback do usuário logado
  const nomeLogado = usuarioLogado()
  if (feedbacks.value[idx].usuario === nomeLogado) {
    feedbacks.value.splice(idx, 1)
    salvarFeedbacks(produtoSelecionado.value.id)
  }
}

function abrirFeedbackForm() {
  feedbackFormAberto.value = true
}
function fecharFeedbackForm() {
  feedbackFormAberto.value = false
  novoFeedback.value = { usuario: usuarioLogado(), nota: 5, comentario: '' }
}

function usuarioLogado() {
  // Busca o nome do usuário logado no localStorage
  const u = localStorage.getItem('usuario')
  if (u) {
    try {
      const obj = JSON.parse(u)
      return obj.nome || ''
    } catch {
      // Falha ao fazer parse do usuário, retorna string vazia
    }
  }
  return ''
}

function abrirModal(produto) {
  produtoSelecionado.value = produto
  modalAberto.value = true
  quantidade.value = 1
  carregarFeedbacks(produto.id)
  novoFeedback.value.usuario = usuarioLogado()
  feedbackFormAberto.value = false
}
function fecharModal() {
  modalAberto.value = false
  produtoSelecionado.value = null
}
function aumentarQtd() {
  quantidade.value++
}
function diminuirQtd() {
  if (quantidade.value > 1) quantidade.value--
}
function comprarAgora() {
  if (props.adicionarAoCarrinho && produtoSelecionado.value) {
    props.adicionarAoCarrinho(produtoSelecionado.value, quantidade.value)
    fecharModal()
    alertMsg.value = 'Produto adicionado ao carrinho!'
    showAlert.value = true
    setTimeout(() => { showAlert.value = false }, 2200)
  }
}

function isFavoritado(p) {
  return props.favoritos && props.favoritos.some(f => f.id === p.id && f.nome === p.nome && f.marca === p.marca)
}

function toggleFeedbacks() {
  feedbacksVisiveis.value = !feedbacksVisiveis.value
}
</script>

<template>
  <div class="produtos-list" :class="{ expandido: props.expandido }">
    <div v-for="produto in props.produtos" :key="produto.id" class="produto-card">
      <div class="favorito-icone" @click.stop="emit('toggle-favorito', produto)">
        <img :src="isFavoritado(produto) ? favoritoCheioImg : favoritoVazioImg"
             :class="{ 'favoritado': isFavoritado(produto) }"
             alt="Favorito" />
      </div>
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
          <!-- Área de feedbacks dos usuários -->
          <div class="feedbacks-area">
            <h4 style="display:flex;align-items:center;gap:8px;">
              Feedbacks dos usuários
              <span @click="toggleFeedbacks" class="toggle-feedbacks-seta" :title="feedbacksVisiveis ? 'Recolher feedbacks' : 'Mostrar feedbacks'">
                <svg v-if="feedbacksVisiveis" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4511e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4511e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </h4>
            <div v-if="feedbacksVisiveis">
              <div v-if="feedbacks.length">
                <div v-for="(fb, idx) in feedbacks" :key="idx" class="feedback-item">
                  <div class="feedback-usuario">
                    {{ fb.usuario }} <span class="feedback-nota">★ {{ fb.nota }}</span>
                    <button v-if="fb.usuario === usuarioLogado()" class="remover-feedback-btn" @click="removerFeedback(idx)">Remover</button>
                  </div>
                  <div class="feedback-comentario">{{ fb.comentario }}</div>
                </div>
              </div>
              <div v-else class="feedback-vazio">Nenhum feedback para este produto ainda.</div>
              <!-- Botão para abrir o formulário de feedback -->
              <button v-if="!feedbackFormAberto" class="abrir-feedback-btn" @click="abrirFeedbackForm">Adicionar feedback</button>
              <!-- Formulário para novo feedback -->
              <form v-if="feedbackFormAberto" class="feedback-form" @submit.prevent="enviarFeedback" style="margin-top:12px;">
                <input v-model="novoFeedback.usuario" placeholder="Seu nome" required disabled style="margin-bottom:6px; background:#f3f3f3; color:#888;" />
                <select v-model="novoFeedback.nota" required style="margin-bottom:6px;">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} estrela{{ n > 1 ? 's' : '' }}</option>
                </select>
                <textarea v-model="novoFeedback.comentario" placeholder="Seu comentário" required rows="2" style="margin-bottom:6px;"></textarea>
                <div style="display:flex; gap:10px;">
                  <button type="submit">Enviar feedback</button>
                  <button type="button" @click="fecharFeedbackForm" style="background:#eee;color:#f4511e;">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
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
          <div class="ml-qtd-area">
            <button class="ml-qtd-btn" @click="diminuirQtd">-</button>
            <span class="ml-qtd">{{ quantidade }}</span>
            <button class="ml-qtd-btn" @click="aumentarQtd">+</button>
            <span class="ml-qtd-label">unidades</span>
          </div>
          <div class="ml-total">Total: <b>R$ {{ valorTotal.toFixed(2) }}</b></div>
          <button class="ml-btn-comprar" @click="comprarAgora">Comprar agora</button>
          <p class="ml-descricao">{{ produtoSelecionado.descricao }}</p>
        </div>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div v-if="showAlert" class="alerta-top alerta-carrinho">
      {{ alertMsg }}
    </div>
  </transition>
</template>

<style scoped>
.produtos-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
  padding: 6px;
}

.produtos-list.expandido {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .produtos-list.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }
}
@media (max-width: 600px) {
  .produtos-list.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }
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
  position: relative;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
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

.ml-qtd-area {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 18px 0;
}

.ml-qtd-btn {
  background: #f3f6fa;
  border: 1px solid #eee;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  font-size: 1.3rem;
  color: #f4511e;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.ml-qtd-btn:hover {
  background: #ffe0b2;
}

.ml-qtd {
  min-width: 32px;
  text-align: center;
  font-size: 1.15rem;
  font-weight: 600;
  color: #222;
}

.ml-qtd-label {
  font-size: 1rem;
  color: #888;
  margin-left: 4px;
}

.ml-total {
  font-size: 1.18rem;
  color: #f4511e;
  font-weight: 700;
  margin-bottom: 12px;
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

.produtos-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
}
.produto-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px #0001;
  padding: 18px 12px 16px 12px;
  width: 260px;
  min-width: 220px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
}
.produto-card:hover {
  box-shadow: 0 6px 24px #f4511e33;
  transform: translateY(-2px) scale(1.01);
}
.produto-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
}
.produto-nome {
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: center;
}
.produto-preco {
  color: #f4511e;
  font-size: 1.12rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.produto-btn {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
.produto-btn:hover {
  background: #d84315;
}
@media (max-width: 900px) {
  .produtos-lista {
    gap: 18px;
    justify-content: center;
  }
  .produto-card {
    width: 44vw;
    min-width: 160px;
    max-width: 99vw;
    padding: 12px 6px 12px 6px;
  }
  .produto-img {
    width: 80px;
    height: 80px;
  }
}
@media (max-width: 600px) {
  .produtos-lista {
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }
  .produto-card {
    width: 98vw;
    min-width: 0;
    max-width: 99vw;
    padding: 10px 2vw 10px 2vw;
  }
  .produto-img {
    width: 60px;
    height: 60px;
  }
}

.produtos-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  justify-content: flex-start;
}
@media (max-width: 900px) {
  .produtos-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    justify-content: center;
  }
}
@media (max-width: 600px) {
  .produtos-list {
    grid-template-columns: 1fr;
    gap: 8px;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 900px) {
  .produtos-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
@media (max-width: 600px) {
  .produtos-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 900px) {
  .produtos-list.expandido {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

.favorito-icone {
  position: absolute;
  top: 12px;
  right: 18px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 2;
}
.favorito-icone img {
  width: 100%;
  height: 100%;
  filter: grayscale(1) brightness(1.5);
  opacity: 0.7;
  transition: filter 0.2s, opacity 0.2s;
}
.favorito-icone img.favoritado {
  filter: invert(18%) sepia(99%) saturate(7482%) hue-rotate(357deg) brightness(97%) contrast(119%);
}

.alerta-top.alerta-carrinho {
  position: fixed;
  top: 32px;
  right: 32px;
  background: #fff;
  color: #388e3c;
  border: 2px solid #b6e2c1;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0003;
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
@keyframes fadeInRight {
  from { opacity: 0; right: 0; }
  to { opacity: 1; right: 32px; }
}

@media (min-width: 1590px) and (max-width: 1610px) and (min-height: 700px) and (max-height: 740px) {
  .alerta-top,
  .alerta-carrinho,
  .alert-confirmacao {
    top: 120px !important;
  }
}

.feedbacks-area {
  width: 100%;
  margin-top: 18px;
  background: #f7f8fa;
  border-radius: 10px;
  box-shadow: 0 1px 4px #0001;
  padding: 18px 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.feedbacks-area h4 {
  margin: 0 0 8px 0;
  color: #f4511e;
  font-size: 1.08rem;
  font-weight: 700;
}
.feedback-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px #0001;
  padding: 10px 12px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.feedback-usuario {
  font-weight: 600;
  color: #1976d2;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.feedback-nota {
  color: #f59e0b;
  font-size: 0.98rem;
  margin-left: 4px;
}
.feedback-comentario {
  color: #444;
  font-size: 0.98rem;
  margin-left: 2px;
}
.feedback-vazio {
  color: #888;
  font-size: 0.98rem;
  text-align: center;
  margin: 8px 0;
}
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px #0001;
  padding: 10px 12px;
  margin-top: 10px;
}
.feedback-form input,
.feedback-form select,
.feedback-form textarea {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.98rem;
  background: #f7f8fa;
}
.feedback-form button {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
}
.feedback-form button:hover {
  background: #d84315;
}

.abrir-feedback-btn {
  background: linear-gradient(90deg, #f59e0b 60%, #f4511e 100%);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 22px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px #fbbf2422;
  transition: background 0.2s, transform 0.2s;
}
.abrir-feedback-btn:hover {
  background: linear-gradient(90deg, #f4511e 60%, #f59e0b 100%);
  transform: scale(1.04);
}

/* CSS para o botão de remover feedback */
.remover-feedback-btn {
  background: #fff0f0;
  color: #e11d48;
  border: 1px solid #e11d48;
  border-radius: 6px;
  font-size: 0.92rem;
  padding: 2px 10px;
  margin-left: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.remover-feedback-btn:hover {
  background: #e11d48;
  color: #fff;
}

.toggle-feedbacks-seta {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  user-select: none;
}
.toggle-feedbacks-seta:hover {
  transform: scale(1.15);
  background: #fff3e0;
  border-radius: 50%;
}
</style>
