  <template>
  <footer class="footer-site">
    <div class="footer-content">
      <img src="@/assets/imagens/logo.png" alt="Logo" class="footer-logo" />
      <div class="footer-info">
        <div>© {{ new Date().getFullYear() }} SEPE. Todos os direitos reservados.</div>
        <div>Desenvolvido por SEPE - Semana de Ensino Pesquisa e Extensão</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineOptions({ name: 'AppFooter' })
// Nenhuma lógica JS necessária para o footer
</script>

<style scoped>
.footer-site {
  width: 100vw;
  background: #f4511e;
  color: #fff;
  padding: 24px 0 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  position: relative;
  z-index: 1;
}
.footer-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.footer-logo {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 2px 8px #0002;
}
.footer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 1rem;
}
@media (max-width: 600px) {
  .footer-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  .footer-logo {
    width: 38px;
    height: 38px;
  }
  .footer-info {
    font-size: 0.95rem;
  }
}
</style>
