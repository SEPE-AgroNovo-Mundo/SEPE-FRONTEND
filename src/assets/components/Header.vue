<script>
export default {
  name: "AppHeader"
};
</script>

<template>
  <header class="header">
    <div class="header-left">
      <img src="@/assets/imagens/logo.png" alt="Logo" class="logo" />
      <nav class="menu">
        <a  @click.prevent="$router.push('/medicamentos')">Medicamentos</a>
        <a @click.prevent="$router.push('/Ferragens')">Ferragens</a>
        <a href="#">Hormônios</a>
        <a href="#">Rações</a>
        <a href="#">Pragas</a>
        <a href="#">Pets</a>
      </nav>
    </div>
    <div class="header-right">
      <input type="text" class="busca" placeholder="O que você precisa hoje?" />
      <span class="icon cart">🛒</span>
      <span class="icon user">👤</span>

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
  gap: 22px;
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
