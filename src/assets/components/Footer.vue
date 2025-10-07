<template>
  <footer class="footer-agro">
    <div class="footer-agro-content">
      <div class="footer-agro-col logo-col">
        <img src="@/assets/imagens/logo.png" alt="Logo" class="footer-agro-logo" />
        <div class="footer-agro-titulo">SEPE Agropecuária</div>
        <div class="footer-agro-slogan">Tudo para o campo, com qualidade!</div>
      </div>
      <div class="footer-agro-col info-col">
        <div class="footer-agro-section-title">Contato</div>
        <div class="footer-agro-contact">
          <span>📞 (47) 99999-9999</span>
          <span>✉️ contato@sepeagro.com</span>
          <span>📍 Av. agricola, 123 - Araquari/SC</span>
        </div>
      </div>
      <div class="footer-agro-col social-col">
        <div class="footer-agro-section-title">Redes Sociais</div>
        <div class="footer-agro-social">
          <a href="#" title="Instagram" class="footer-agro-social-link">🐄 Instagram</a>
          <a href="#" title="Facebook" class="footer-agro-social-link">🌾 Facebook</a>
          <a href="#" title="WhatsApp" class="footer-agro-social-link">🐑 WhatsApp</a>
        </div>
      </div>
    </div>
    <div class="footer-agro-bottom">
      <span>© {{ new Date().getFullYear() }} SEPE Agropecuária/Informática. Todos os direitos reservados.</span>
      <span class="footer-agro-dev">Desenvolvido por <b>Higor (3INFO1)</b> | Semana de Ensino Pesquisa e Extensão</span>
    </div>
  </footer>
</template>

<script setup>
defineOptions({ name: 'AppFooter' })
</script>

<style scoped>
.footer-agro {
  width: 100vw;
  background: linear-gradient(90deg, #388e3c 90%, #fff 100%);
  color: #ffffff;
  padding: 0;
  margin-top: 48px;
  box-shadow: 0 0 24px #388e3c22;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.footer-agro-content {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 32px;
  padding: 36px 8vw 18px 8vw;
  flex-wrap: wrap;
}
.footer-agro-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 180px;
}
.logo-col {
  align-items: flex-start;
  gap: 8px;
}
.footer-agro-logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 2px 12px #0002;
}
.footer-agro-titulo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #ffffff;
  text-shadow: 0 2px 8px #388e3c33;
}
.footer-agro-slogan {
  font-size: 1.08rem;
  color: #ffffff;
  opacity: 0.92;
  margin-top: 2px;
}
.footer-agro-section-title {
  font-size: 1.08rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #fcfcfc;
  letter-spacing: 1px;
}
.footer-agro-contact span {
  display: block;
  font-size: 1rem;
  margin-bottom: 2px;
  opacity: 0.95;
  color: #ffffff;
}
.footer-agro-social {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.footer-agro-social-link {
  color: #f8f8f8;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}
.footer-agro-social-link:hover {
  color: #ff9800;
  text-decoration: underline;
}
.footer-agro-bottom {
  background: #fff;
  color: #388e3c;
  font-size: 0.98rem;
  padding: 12px 8vw 10px 8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border-top: 1px solid #388e3c22;
}
.footer-agro-dev {
  font-size: 0.95rem;
  color: #ff9800;
  opacity: 0.92;
}
@media (max-width: 900px) {
  .footer-agro-content {
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 28px 2vw 12px 2vw;
  }
  .footer-agro-col {
    align-items: center;
    min-width: 0;
  }
  .logo-col {
    align-items: center;
  }
}
</style>
