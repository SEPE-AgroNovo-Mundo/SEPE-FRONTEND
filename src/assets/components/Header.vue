<script>
export default {
  name: 'AppHeader'
}
</script>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({ modelValue: String, onAbrirCarrinho: Function })
const emit = defineEmits(['update:modelValue'])

const usuario = {
  imagem: ''
}
if (typeof window !== 'undefined') {
  const dados = localStorage.getItem('usuario');
  if (dados) {
    const user = JSON.parse(dados);
    usuario.imagem = user.imagem || '';
  }
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <img src="@/assets/imagens/logo.png" alt="Logo" class="logo" @click="$router.push('/')" style="cursor:pointer;" />
      <nav class="menu">
        <a @click.prevent="$router.push('/medicamentos')">Medicamentos</a>
        <a @click.prevent="$router.push('/Ferragens')">Ferragens</a>
        <a @click.prevent="$router.push('/hormonios')">Hormônios</a>
        <a @click.prevent="$router.push('/racoes')">Rações</a>
        <a @click.prevent="$router.push('/pragas')">Pragas</a>
        <a @click.prevent="$router.push('/pets')">Pets</a>
      </nav>
    </div>
    <div class="header-right">
      <input type="text" class="busca" placeholder="O que você precisa hoje?" :value="props.modelValue"
        @input="emit('update:modelValue', $event.target.value)" />
      <span class="icon heart">❤️</span>
      <span class="icon cart" @click="props.onAbrirCarrinho && props.onAbrirCarrinho()">🛒</span>
      <img v-if="usuario.imagem" :src="usuario.imagem" class="perfil-header" @click="$router.push('/perfil')"
        alt="Perfil" />
      <span v-else class="icon user" @click="$router.push('/perfil')">👤</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 12px #0001;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 80px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  width: 64px;
  height: 64px;
}

.menu {
  display: flex;
}

.menu a {
  color: #f4511e;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.08rem;
  padding: 6px 14px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.menu a:hover {
  background: #f4511e22;
  color: #d84315;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.busca {
  padding: 9px 20px;
  border-radius: 24px;
  border: 1px solid #eee;
  font-size: 1.08rem;
  width: 260px;
  background: #f3f6fa;
}

.icon {
  font-size: 2rem;
  color: #f4511e;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.2s;
}

.icon:hover {
  color: #d84315;
}

.perfil-header {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f4511e44;
  background: #f3f6fa;
  cursor: pointer;
  margin-left: 10px;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px #f4511e22;
}

.perfil-header:hover {
  box-shadow: 0 4px 16px #f4511e33;
}

@media (max-width: 900px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 12px 8px;
  }

  .header-left {
    gap: 12px;
  }

  .menu {
    gap: 8px;
    flex-wrap: wrap;
  }

  .busca {
    width: 100px;
    font-size: 1rem;
  }
}
</style>
