<script>
export default {
  name: 'AppHeader'
}
</script>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
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

const menuAberto = ref(false)
function toggleMenu() {
  menuAberto.value = !menuAberto.value
}
function fecharMenu() {
  menuAberto.value = false
}

const telaPequena = ref(false)
function checarTela() {
  telaPequena.value = window.innerWidth <= 440
}
onMounted(() => {
  checarTela()
  window.addEventListener('resize', checarTela)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checarTela)
})
</script>

<template>
  <header class="header">
    <div class="header-left">
      <img src="@/assets/imagens/logo.png" alt="Logo" class="logo" @click="$router.push('/')" style="cursor:pointer;" />
      <nav class="menu" :class="{ aberto: menuAberto }">
        <a @click.prevent="$router.push('/medicamentos'); fecharMenu()">Medicamentos</a>
        <a @click.prevent="$router.push('/Ferragens'); fecharMenu()">Ferragens</a>
        <a @click.prevent="$router.push('/hormonios'); fecharMenu()">Hormônios</a>
        <a @click.prevent="$router.push('/racoes'); fecharMenu()">Rações</a>
        <a @click.prevent="$router.push('/pragas'); fecharMenu()">Pragas</a>
        <a @click.prevent="$router.push('/pets'); fecharMenu()">Pets</a>
        <a v-if="telaPequena" @click.prevent="$router.push('/favoritos'); fecharMenu()">
          <img src="@/assets/imagens/favorito.png" alt="Favoritos" style="width: 22px; vertical-align: middle; margin-right: 6px;" /> Favoritos
        </a>
      </nav>
      <div class="header-icons">
        <input type="text" class="busca" placeholder="O que você precisa hoje?" :value="props.modelValue"
          @input="emit('update:modelValue', $event.target.value)" />
        <img v-if="!telaPequena" src="@/assets/imagens/favorito.png" alt="Favoritos" class="icon heart" style="width: 28px; cursor: pointer;" @click="$router.push('/favoritos')" />
        <img src="@/assets/imagens/comprar.png" alt="Carrinho" class="icon cart" style="width: 28px; cursor: pointer;" @click="props.onAbrirCarrinho && props.onAbrirCarrinho()" />
        <img v-if="usuario.imagem" :src="usuario.imagem" class="perfil-header" @click="$router.push('/perfil')"
          alt="Perfil" />
        <span v-else class="icon user" @click="$router.push('/perfil')">👤</span>
        <button class="menu-hamburguer" @click="toggleMenu" aria-label="Abrir menu">
          <span :class="{ aberto: menuAberto }"></span>
          <span :class="{ aberto: menuAberto }"></span>
          <span :class="{ aberto: menuAberto }"></span>
        </button>
      </div>
    </div>
    <div v-if="menuAberto" class="menu-overlay" @click="fecharMenu"></div>
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
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 80px;
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

.menu-hamburguer {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  z-index: 120;
}

.menu-hamburguer span {
  display: block;
  width: 28px;
  height: 4px;
  background: #f4511e;
  margin: 4px 0;
  border-radius: 2px;
  transition: 0.3s;
}

.menu-hamburguer span.aberto:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-hamburguer span.aberto:nth-child(2) {
  opacity: 0;
}

.menu-hamburguer span.aberto:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  z-index: 110;
}

@media (max-width: 900px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 12px 8px;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
    gap: 8px;
    justify-content: space-between;
  }

  .header-icons {
    margin-left: 0;
  }

  .menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 70vw;
    max-width: 320px;
    height: 100vh;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding: 32px 0 0 0;
    box-shadow: 2px 0 16px #0002;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.3s;
    border-radius: 0 18px 18px 0;
  }

  .menu.aberto {
    transform: translateX(0);
  }

  .menu a {
    width: 100%;
    padding: 18px 24px;
    border-radius: 0;
    font-size: 1.12rem;
    border-bottom: 1px solid #f3f6fa;
    color: #f4511e;
    background: none;
  }

  .menu a:last-child {
    border-bottom: none;
  }

  .menu-hamburguer {
    display: flex;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
  }

  .busca {
    width: 100px;
    font-size: 1rem;
    margin-right: 8px;
  }
}

@media (max-width: 600px) {
  .header {
    padding: 6px 2px;
  }

  .menu {
    width: 90vw;
    max-width: 99vw;
    padding: 18px 0 0 0;
  }

  .menu a {
    font-size: 1rem;
    padding: 14px 14px;
  }

  .header-right {
    gap: 6px;
  }

  .busca {
    width: 70px;
    font-size: 0.95rem;
    margin-right: 4px;
  }
}

.header {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
@media (max-width: 900px) {
  .header {
    padding: 0 2vw;
  }
}
@media (max-width: 600px) {
  .header {
    padding: 0 1vw;
  }
}
@media (max-width: 440px) {
  .header {
    padding: 0 0.5vw;
  }
}
</style>
