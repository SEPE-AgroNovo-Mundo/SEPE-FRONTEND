<script setup>
defineProps({ produtos: Array })
</script>

<template>
  <div class="produtos-list">
    <div v-for="produto in produtos" :key="produto.id" class="produto-card">
      <img :src="produto.imagem" :alt="produto.nome" class="produto-img" />
      <div class="produto-info">
        <h2 class="produto-nome">{{ produto.nome }}</h2>
        <p class="produto-marca">Marca: {{ produto.marca }}</p>
        <p class="produto-descricao">{{ produto.descricao || 'Descrição do produto.' }}</p>
        <div class="produto-preco">R$ {{ produto.preco.toFixed(2) }}</div>
        <button class="btn-comprar">Comprar</button>
      </div>
    </div>
    <div v-if="!produtos.length" class="nenhum-produto">Nenhum produto encontrado.</div>
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
</style>
