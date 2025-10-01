<script setup>
defineOptions({ name: 'AppCarrinho' })
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
const props = defineProps({
  produtos: Array
})
const emit = defineEmits(['fechar', 'alterarQtd', 'remover'])

const selecionados = ref(props.produtos.map(p => p.id))

watch(() => props.produtos, (novos) => {
  selecionados.value = selecionados.value.filter(id => novos.some(p => p.id === id))
  if (selecionados.value.length === 0 && novos.length > 0) {
    selecionados.value = novos.map(p => p.id)
  }
}, { immediate: true, deep: true })

const total = computed(() =>
  props.produtos.filter(p => selecionados.value.includes(p.id)).reduce((soma, p) => soma + p.preco * p.quantidade, 0)
)
</script>

<template>
  <div class="carrinho-modal">
    <div class="carrinho-box">
      <button class="carrinho-fechar" @click="emit('fechar')">&times;</button>
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
                <span class="carrinho-link">Alterar</span>
              </div>
            </div>
            <div class="carrinho-qtd-area">
              <button class="carrinho-qtd-btn" @click="emit('alterarQtd', {produto, delta: -1})">-</button>
              <span class="carrinho-qtd">{{ produto.quantidade }}</span>
              <button class="carrinho-qtd-btn" @click="emit('alterarQtd', {produto, delta: 1})">+</button>
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
          <button class="carrinho-btn-finalizar">Continuar a compra</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carrinho-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
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
