<script setup>
defineOptions({ name: 'AppCarrinho' })
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
const props = defineProps({
  produtos: Array
})
const emit = defineEmits(['fechar', 'alterarQtd', 'remover'])

const selecionados = ref(props.produtos.map(p => p.id))
const step = ref(1)
const endereco = ref({ nome: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' })
const tipoCompra = ref('')
const tipoPagamento = ref('')
const tipoCartao = ref('')
const precisaTroco = ref(false)
const valorTroco = ref('')

const showConfirmAlert = ref(false)
const errorMessage = ref('')
const showError = ref(false)

function exibirErro(msg) {
  errorMessage.value = msg
  showError.value = true
  setTimeout(() => {
    showError.value = false
    errorMessage.value = ''
  }, 2600)
}

watch(() => props.produtos, (novos) => {
  selecionados.value = selecionados.value.filter(id => novos.some(p => p.id === id))
  if (selecionados.value.length === 0 && novos.length > 0) {
    selecionados.value = novos.map(p => p.id)
  }
}, { immediate: true, deep: true })

const total = computed(() =>
  props.produtos.filter(p => selecionados.value.includes(p.id)).reduce((soma, p) => soma + p.preco * p.quantidade, 0)
)

function continuarCompra() {
  if (step.value === 1) {
    if (selecionados.value.length === 0) {
      exibirErro('Selecione pelo menos um produto para comprar!')
      return
    }
    step.value = 2
  } else if (step.value === 2) {
    if (!tipoCompra.value) {
      exibirErro('Selecione o tipo de recebimento!')
      return
    }
    // Se for entrega, pede endereço, senão pula para pagamento
    if (tipoCompra.value === 'entrega') {
      step.value = 3
    } else {
      step.value = 4
    }
  } else if (step.value === 3) {
    // Validação simples do endereço
    if (!endereco.value.nome || !endereco.value.rua || !endereco.value.numero || !endereco.value.bairro || !endereco.value.cidade || !endereco.value.estado || !endereco.value.cep) {
      exibirErro('Preencha todos os campos do endereço!')
      return
    }
    step.value = 4
  } else if (step.value === 4) {
    if (!tipoPagamento.value) {
      exibirErro('Selecione o tipo de pagamento!')
      return
    }
    if (tipoPagamento.value === 'cartao' && !tipoCartao.value) {
      exibirErro('Selecione débito ou crédito!')
      return
    }
    if (tipoPagamento.value === 'dinheiro' && precisaTroco.value && (!valorTroco.value || isNaN(Number(valorTroco.value)) || Number(valorTroco.value) <= total.value)) {
      exibirErro('Informe um valor válido para o troco!')
      return
    }
    step.value = 5
  } else if (step.value === 5) {
    showConfirmAlert.value = true
    setTimeout(() => {
      showConfirmAlert.value = false
      emit('fechar')
      step.value = 1
      tipoCompra.value = ''
      endereco.value = { nome: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' }
      tipoPagamento.value = ''
      tipoCartao.value = ''
      precisaTroco.value = false
      valorTroco.value = ''
    }, 2200)
  }
}

function voltarEtapa() {
  if (step.value === 4 && tipoCompra.value === 'retirar') {
    step.value = 2
    return
  }
  if (step.value === 3 && tipoCompra.value === 'entrega') {
    step.value = 2
    return
  }
  if (step.value > 1) {
    step.value -= 1
  }
}
</script>

<template>
  <div class="carrinho-modal">
    <div class="carrinho-box">
      <div v-if="showError" class="alert-erro">
        <span>{{ errorMessage }}</span>
        <button class="fechar-alerta" @click="showError = false">×</button>
      </div>
      <button class="carrinho-fechar" @click="emit('fechar')">&times;</button>
      <div v-if="showConfirmAlert" class="alert-confirmacao">
        <div class="alert-content">
          <span class="alert-icon">🎉</span>
          <div class="alert-msg">Seu pedido foi realizado com sucesso!</div>
        </div>
      </div>
      <div v-if="showError" class="alert-confirmacao">
        <div class="alert-content">
          <span class="alert-icon">⚠️</span>
          <div class="alert-msg">{{ errorMessage }}</div>
        </div>
      </div>
      <div v-if="step === 1">
        <div class="carrinho-flex">
          <div class="carrinho-lista">
            <div v-for="produto in props.produtos" :key="produto.id" class="carrinho-item">
              <input type="checkbox" v-model="selecionados" :value="produto.id" style="margin-right:8px" />
              <img :src="produto.imagem" class="carrinho-img" />
              <div class="carrinho-info">
                <div class="carrinho-nome">{{ produto.nome }}</div>
                <div class="carrinho-var">Cor: {{ produto.cor || '-' }}</div>
                <div class="carrinho-acoes">
                  <span class="carrinho-link" @click="emit('remover', produto)">Excluir</span>
                </div>
              </div>
              <div class="carrinho-qtd-area">
                <button class="carrinho-qtd-btn" @click="emit('alterarQtd', { produto, delta: -1 })">-</button>
                <span class="carrinho-qtd">{{ produto.quantidade }}</span>
                <button class="carrinho-qtd-btn" @click="emit('alterarQtd', { produto, delta: 1 })">+</button>
                <span class="carrinho-disponivel">+10 disponíveis</span>
              </div>
              <div class="carrinho-preco-area">
                <span v-if="produto.precoAntigo" class="carrinho-preco-antigo">R$ {{ produto.precoAntigo.toFixed(2) }}</span>
                <span class="carrinho-preco">R$ {{ produto.preco.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div class="carrinho-resumo">
            <div class="carrinho-resumo-titulo">Resumo da compra</div>
            <div class="carrinho-resumo-total">
              <span>Total</span>
              <span>R$ {{ total.toFixed(2) }}</span>
            </div>
            <button class="carrinho-btn-finalizar" @click="continuarCompra">Continuar a compra</button>
          </div>
        </div>
      </div>
      <div v-else-if="step === 2" class="carrinho-etapa">
        <h3>Tipo de recebimento</h3>
        <div class="tipo-compra-opcoes">
          <label class="tipo-compra-opcao" :class="{ selected: tipoCompra === 'retirar' }">
            <input type="radio" v-model="tipoCompra" value="retirar" /> Retirar na Distribuidora
          </label>
          <label class="tipo-compra-opcao" :class="{ selected: tipoCompra === 'entrega' }">
            <input type="radio" v-model="tipoCompra" value="entrega" /> Receber em casa
          </label>
        </div>
        <div class="botoes-centro">
          <button type="button" @click="voltarEtapa">Voltar</button>
          <button type="button" @click="continuarCompra">Próximo</button>
        </div>
      </div>
      <div v-else-if="step === 3 && tipoCompra === 'entrega'" class="carrinho-etapa">
        <h3>Endereço de entrega</h3>
        <form @submit.prevent="continuarCompra">
          <input v-model="endereco.nome" placeholder="Nome completo" required />
          <input v-model="endereco.rua" placeholder="Rua" required />
          <input v-model="endereco.numero" placeholder="Número" required />
          <input v-model="endereco.bairro" placeholder="Bairro" required />
          <input v-model="endereco.cidade" placeholder="Cidade" required />
          <input v-model="endereco.estado" placeholder="estado" maxlength="2" required />
          <input v-model="endereco.cep" placeholder="CEP" required />
          <div class="botoes-centro">
            <button type="button" @click="voltarEtapa">Voltar</button>
            <button type="submit">Próximo</button>
          </div>
        </form>
      </div>
      <div v-else-if="(step === 3 && tipoCompra === 'retirar') || step === 4" class="carrinho-etapa">
        <h3>Pagamento</h3>
        <div class="tipo-compra-opcoes">
          <label class="tipo-compra-opcao" :class="{ selected: tipoPagamento === 'dinheiro' }">
            <input type="radio" v-model="tipoPagamento" value="dinheiro" /> Dinheiro
          </label>
          <label class="tipo-compra-opcao" :class="{ selected: tipoPagamento === 'pix' }">
            <input type="radio" v-model="tipoPagamento" value="pix" /> Pix
          </label>
          <label class="tipo-compra-opcao" :class="{ selected: tipoPagamento === 'cartao' }">
            <input type="radio" v-model="tipoPagamento" value="cartao" /> Cartão
          </label>
        </div>
        <div v-if="tipoPagamento === 'cartao'" style="margin-bottom:18px; text-align:center;">
          <label style="margin-right:18px;">
            <input type="radio" v-model="tipoCartao" value="debito" /> Débito
          </label>
          <label>
            <input type="radio" v-model="tipoCartao" value="credito" /> Crédito
          </label>
        </div>
        <div v-if="tipoPagamento === 'dinheiro'" style="margin-bottom:18px; text-align:center;">
          <label>
            <input type="checkbox" v-model="precisaTroco" /> Precisa de troco?
          </label>
          <div v-if="precisaTroco" style="margin-top:10px;">
            <input v-model="valorTroco" type="number" min="0" :placeholder="'Valor que será pago em dinheiro'" style="padding:8px 12px; border-radius:6px; border:1px solid #ddd; width:180px;" />
            <span style="font-size:0.98rem; color:#888; margin-left:6px;">Total da compra: R$ {{ total.toFixed(2) }}</span>
          </div>
        </div>
        <div class="botoes-centro">
          <button type="button" @click="voltarEtapa">Voltar</button>
          <button type="button" @click="continuarCompra">Próximo</button>
        </div>
      </div>
      <div v-else-if="step === 5" class="carrinho-etapa">
        <h3>Confirmação da compra</h3>
        <div class="confirmacao-compra">
          <div v-if="tipoCompra === 'entrega'">
            <b>Endereço:</b><br />
            {{ endereco.nome }}, {{ endereco.rua }}, {{ endereco.numero }}, {{ endereco.bairro }}, {{ endereco.cidade }}-{{ endereco.estado }}, CEP: {{ endereco.cep }}
          </div>
          <div>
            <b>Tipo de retirada:</b> {{ tipoCompra === 'retirar' ? 'Retirar na loja' : 'Receber em casa' }}
          </div>
          <div>
            <b>Pagamento:</b>
            <span v-if="tipoPagamento === 'dinheiro'">Dinheiro <span v-if="precisaTroco">(Troco para R$ {{ valorTroco }})</span></span>
            <span v-else-if="tipoPagamento === 'pix'">Pix</span>
            <span v-else-if="tipoPagamento === 'cartao'">Cartão ({{ tipoCartao === 'debito' ? 'Débito' : 'Crédito' }})</span>
          </div>
          <div>
            <b>Produtos:</b>
            <ul>
              <li v-for="produto in props.produtos.filter(p => selecionados.includes(p.id))" :key="produto.id">
                {{ produto.nome }} ({{ produto.quantidade }}x)
              </li>
            </ul>
          </div>
          <div>
            <b>Total:</b> R$ {{ total.toFixed(2) }}
          </div>
        </div>
        <div class="botoes-centro">
          <button type="button" @click="voltarEtapa">Voltar</button>
          <button type="button" @click="continuarCompra">Confirmar compra</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carrinho-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2000;
  padding-top: 32px;
}

.carrinho-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0002;
  min-width: 700px;
  max-width: 1100px;
  width: 90vw;
  padding: 0;
  position: relative;
}

.carrinho-fechar {
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #f4511e;
  cursor: pointer;
  z-index: 10;
}

.carrinho-flex {
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 32px 24px 24px 24px;
}

.carrinho-lista {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.carrinho-item {
  background: #fafbfc;
  border-radius: 8px;
  box-shadow: 0 1px 4px #0001;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 18px;
}

.carrinho-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f6fa;
}

.carrinho-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.carrinho-nome {
  font-size: 1.08rem;
  font-weight: 700;
  color: #222;
}

.carrinho-var {
  font-size: 0.98rem;
  color: #666;
}

.carrinho-acoes {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.carrinho-link {
  color: #1976d2;
  font-size: 0.98rem;
  cursor: pointer;
  text-decoration: underline;
}

.carrinho-qtd-area {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 18px;
}

.carrinho-qtd-btn {
  background: #f3f6fa;
  border: 1px solid #eee;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  color: #f4511e;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.carrinho-qtd-btn:hover {
  background: #ffe0b2;
}

.carrinho-qtd {
  min-width: 22px;
  text-align: center;
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
}

.carrinho-disponivel {
  font-size: 0.92rem;
  color: #888;
  margin-left: 8px;
}

.carrinho-preco-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 90px;
  margin-left: 18px;
}

.carrinho-preco-antigo {
  color: #888;
  font-size: 0.98rem;
  text-decoration: line-through;
}

.carrinho-preco {
  color: #388e3c;
  font-size: 1.18rem;
  font-weight: 700;
}

.carrinho-resumo {
  flex: 1;
  background: #f7f8fa;
  border-radius: 10px;
  box-shadow: 0 1px 4px #0001;
  padding: 24px 18px;
  max-width: 320px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}

.carrinho-resumo-titulo {
  font-size: 1.12rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}

.carrinho-resumo-total {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 1.18rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
}

.carrinho-btn-finalizar {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  width: 100%;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.carrinho-btn-finalizar:hover {
  background: #1256a3;
}

.carrinho-etapa form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f7f8fa;
  border-radius: 10px;
  padding: 24px 18px;
  max-width: 420px;
  margin: 0 auto;
  box-shadow: 0 1px 4px #0001;
}

.carrinho-etapa form input {
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #fff;
  outline: none;
  transition: border 0.2s;
}

.carrinho-etapa form input:focus {
  border: 1.5px solid #f4511e;
}

.carrinho-etapa h3 {
  text-align: center;
  color: #f4511e;
  margin-bottom: 18px;
  font-size: 1.18rem;
}

.carrinho-etapa button {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.carrinho-etapa button:hover {
  background: #d84315;
}

.carrinho-etapa .tipo-compra-opcoes {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.carrinho-etapa .tipo-compra-opcao {
  background: #fff;
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 18px 32px;
  font-size: 1.08rem;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px #0001;
  display: flex;
  align-items: center;
  gap: 10px;
}

.carrinho-etapa .tipo-compra-opcao.selected {
  border: 2px solid #f4511e;
  box-shadow: 0 2px 8px #f4511e22;
  color: #f4511e;
  background: #fff7f2;
}

.carrinho-etapa .tipo-compra-opcao input[type="radio"] {
  accent-color: #f4511e;
  width: 18px;
  height: 18px;
}

.carrinho-etapa .botoes-centro {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.carrinho-etapa .confirmacao-compra {
  background: #f7f8fa;
  border-radius: 10px;
  box-shadow: 0 1px 4px #0001;
  padding: 24px 28px;
  max-width: 440px;
  margin: 0 auto 18px auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: 1.08rem;
  color: #333;
}
.carrinho-etapa .confirmacao-compra ul {
  margin: 0 0 0 18px;
  padding: 0;
}
.carrinho-etapa .confirmacao-compra li {
  margin-bottom: 4px;
}
.carrinho-etapa .confirmacao-compra b {
  color: #f4511e;
}

.alert-confirmacao {
  position: fixed;
  top: 32px;
  right: 32px;
  left: auto;
  bottom: auto;
  transform: none;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0003;
  padding: 28px 38px 22px 38px;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInRight 0.3s;
}
@keyframes fadeInRight {
  from { opacity: 0; right: 0; }
  to { opacity: 1; right: 32px; }
}
.alert-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.alert-icon {
  font-size: 2.8rem;
  color: #43a047;
}
.alert-msg {
  font-size: 1.25rem;
  color: #222;
  font-weight: 600;
  margin-top: 6px;
}

.alert-erro {
  background: #ffdddd;
  color: #a94442;
  border: 1px solid #f5c6cb;
  padding: 12px 20px;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.fechar-alerta {
  background: transparent;
  border: none;
  color: #a94442;
  font-size: 20px;
  cursor: pointer;
  margin-left: 16px;
}

@media (max-width: 900px) {
  .carrinho-box {
    min-width: 0;
    max-width: 99vw;
    width: 99vw;
    padding: 0;
  }
  .carrinho-flex {
    flex-direction: column;
    gap: 18px;
    padding: 12px 2vw 12px 2vw;
  }
  .carrinho-lista {
    width: 100%;
    min-width: 0;
  }
  .carrinho-resumo {
    min-width: 0;
    max-width: 99vw;
    width: 100%;
    margin: 18px auto 0 auto;
    align-items: stretch;
  }
  .carrinho-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 8px;
  }
  .carrinho-img {
    width: 60px;
    height: 60px;
  }
  .carrinho-preco-area {
    align-items: flex-start;
    margin-left: 0;
    min-width: 0;
  }
  .carrinho-etapa form,
  .carrinho-etapa .confirmacao-compra {
    max-width: 99vw;
    padding: 14px 4vw;
  }
  .tipo-compra-opcoes {
    flex-direction: column;
    gap: 14px;
    width: 100%;
    align-items: center;
  }
  .tipo-compra-opcao {
    width: 90vw;
    max-width: 320px;
    min-width: 0;
    padding: 12px 8px;
    font-size: 1rem;
  }
  .alert-confirmacao {
    right: 8px;
    top: 8px;
    padding: 18px 12px 14px 12px;
    font-size: 1rem;
  }
  .carrinho-etapa form {
    padding: 8px 2vw;
    max-width: 99vw;
  }
  .carrinho-etapa form label,
  .carrinho-etapa form input,
  .carrinho-etapa form select,
  .carrinho-etapa form button {
    font-size: 0.98rem;
  }
}

@media (max-width: 700px) {
  .carrinho-box {
    min-width: unset;
    max-width: 99vw;
    width: 99vw;
    border-radius: 0;
    padding: 0;
  }
  .carrinho-flex {
    flex-direction: column;
    gap: 16px;
    padding: 16px 4vw 16px 4vw;
  }
  .carrinho-resumo {
    max-width: 100%;
    width: 100%;
    padding: 18px 8px;
    align-items: stretch;
    margin-top: 12px;
  }
  .carrinho-resumo-titulo,
  .carrinho-resumo-total {
    font-size: 1rem;
  }
  .carrinho-btn-finalizar {
    font-size: 1rem;
    padding: 10px 0;
  }
  .carrinho-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 8px;
  }
  .carrinho-preco-area {
    align-items: flex-start;
    margin-left: 0;
    min-width: unset;
  }
  .carrinho-qtd-area {
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .carrinho-box {
    border-radius: 0;
    box-shadow: none;
    padding: 0;
  }
  .carrinho-modal {
    padding-top: 0;
  }
  .carrinho-resumo {
    padding: 12px 4vw;
  }
  .carrinho-etapa form,
  .carrinho-etapa .confirmacao-compra {
    padding: 8px 2vw;
  }
  .alert-confirmacao {
    right: 0;
    top: 0;
    border-radius: 0 0 12px 12px;
    width: 100vw;
    max-width: 100vw;
    justify-content: flex-start;
  }
  .carrinho-etapa form {
    padding: 4px 1vw;
    max-width: 99vw;
    gap: 8px;
  }
  .carrinho-etapa form label,
  .carrinho-etapa form input,
  .carrinho-etapa form select,
  .carrinho-etapa form button {
    font-size: 0.95rem;
  }
}

@media (max-width: 500px) {
  .carrinho-box {
    min-width: unset;
    max-width: 100vw;
    width: 100vw;
    border-radius: 0;
    padding: 0;
  }
  .carrinho-flex {
    flex-direction: column;
    gap: 10px;
    padding: 8px 1vw 8px 1vw;
  }
  .carrinho-resumo {
    padding: 8px 2vw;
    font-size: 0.98rem;
  }
  .carrinho-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 4px;
  }
  .carrinho-img {
    width: 48px;
    height: 48px;
  }
  .carrinho-preco-area {
    align-items: flex-start;
    margin-left: 0;
    min-width: unset;
  }
  .carrinho-qtd-area {
    margin-left: 0;
  }
  .carrinho-etapa form,
  .carrinho-etapa .confirmacao-compra {
    padding: 4px 1vw;
    max-width: 100vw;
    gap: 6px;
  }
  .carrinho-etapa form label,
  .carrinho-etapa form input,
  .carrinho-etapa form select,
  .carrinho-etapa form button {
    font-size: 0.93rem;
  }
  .carrinho-etapa button {
    width: 100%;
    padding: 10px 0;
  }
  .carrinho-etapa input,
  .carrinho-etapa select {
    width: 100%;
    box-sizing: border-box;
  }
  .carrinho-resumo-titulo,
  .carrinho-resumo-total {
    font-size: 0.98rem;
  }
  .alert-confirmacao {
    right: 0;
    top: 0;
    border-radius: 0 0 12px 12px;
    width: 100vw;
    max-width: 100vw;
    justify-content: flex-start;
    padding: 10px 2vw;
    font-size: 0.98rem;
  }
  .carrinho-lista {
    overflow-x: auto;
    width: 100vw;
    min-width: 0;
  }
}

.carrinho {
  width: 400px;
  max-width: 100vw;
  box-sizing: border-box;
}
@media (max-width: 600px) {
  .carrinho {
    width: 100vw;
    padding: 0 1vw;
  }
}

@media (max-width: 900px) {
  .carrinho-box {
    min-width: 0;
    max-width: 99vw;
  }

  .carrinho-flex {
    flex-direction: column;
    gap: 18px;
    padding: 18px 2vw 18px 2vw;
  }

  .carrinho-resumo {
    min-width: 0;
    max-width: 99vw;
    width: 100%;
  }
}
</style>
