<script setup>
import { ref, onMounted } from 'vue'
import logo from '@/assets/imagens/logo.png'

const usuario = ref({
  id: '',
  nome: '',
  email: '',
  imagem: ''
})
const cadastrando = ref(false)
const cadastro = ref({
  nome: '',
  email: '',
  senha: '',
  imagem: ''
})
const showTrocaModal = ref(false)
const usuarios = ref([])
const showSelecionarUsuario = ref(false)
const editando = ref(false)
const editarDados = ref({ nome: '', email: '', imagem: '' })

onMounted(() => {
  const dados = localStorage.getItem('usuario')
  const lista = localStorage.getItem('usuarios')
  if (lista) {
    usuarios.value = JSON.parse(lista)
  }
  if (dados) {
    const user = JSON.parse(dados)
    usuario.value = {
      id: user.id || '',
      nome: user.nome || '',
      email: user.email || '',
      imagem: user.imagem || ''
    }
    cadastrando.value = false
  } else {
    cadastrando.value = true
  }
})

function handleCadastro() {
  if (!cadastro.value.nome || !cadastro.value.email || !cadastro.value.senha) return
  const id = Date.now().toString()
  const novoUsuario = {
    id,
    nome: cadastro.value.nome,
    email: cadastro.value.email,
    imagem: cadastro.value.imagem
  }
  // Salva na lista de usuários (corrigido para não remover outros usuários com mesmo email)
  let lista = localStorage.getItem('usuarios')
  let arr = lista ? JSON.parse(lista) : []
  // Não remover outros usuários, apenas não duplicar o mesmo id
  arr = arr.filter(u => u.id !== novoUsuario.id)
  arr.push(novoUsuario)
  localStorage.setItem('usuarios', JSON.stringify(arr))
  usuarios.value = arr
  localStorage.setItem('usuario', JSON.stringify(novoUsuario))
  usuario.value = novoUsuario
  cadastrando.value = false
}

function handleImagem(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    cadastro.value.imagem = ev.target.result
  }
  reader.readAsDataURL(file)
}

function deslogar() {
  showTrocaModal.value = true
}

function trocarParaUsuarioExistente() {
  showTrocaModal.value = false
  showSelecionarUsuario.value = true
}

function criarNovoUsuario() {
  showTrocaModal.value = false
  usuario.value = { id: '', nome: '', email: '', imagem: '' }
  cadastrando.value = true
}

function selecionarUsuario(u) {
  localStorage.setItem('usuario', JSON.stringify(u))
  usuario.value = u
  cadastrando.value = false
  showSelecionarUsuario.value = false
}

function iniciarEdicao() {
  editarDados.value = {
    nome: usuario.value.nome,
    email: usuario.value.email,
    imagem: usuario.value.imagem
  }
  editando.value = true
}

function salvarEdicao() {
  usuario.value.nome = editarDados.value.nome
  usuario.value.email = editarDados.value.email
  usuario.value.imagem = editarDados.value.imagem
  localStorage.setItem('usuario', JSON.stringify(usuario.value))
  // Atualiza na lista de usuários
  let lista = localStorage.getItem('usuarios')
  let arr = lista ? JSON.parse(lista) : []
  arr = arr.map(u => u.id === usuario.value.id ? usuario.value : u)
  localStorage.setItem('usuarios', JSON.stringify(arr))
  usuarios.value = arr
  editando.value = false
}

function handleImagemEdicao(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    editarDados.value.imagem = ev.target.result
  }
  reader.readAsDataURL(file)
}

function excluirUsuario(id) {
  let lista = localStorage.getItem('usuarios')
  let arr = lista ? JSON.parse(lista) : []
  arr = arr.filter(u => u.id !== id)
  localStorage.setItem('usuarios', JSON.stringify(arr))
  usuarios.value = arr
  // Se o usuário removido for o logado, desloga
  if (usuario.value.id === id) {
    localStorage.removeItem('usuario')
    usuario.value = { id: '', nome: '', email: '', imagem: '' }
    cadastrando.value = true
    showSelecionarUsuario.value = false
  }
}

function onGoogleSuccess(response) {
  // Preenche automaticamente os campos com dados do Google
  if (response && response.profileObj) {
    cadastro.value.nome = response.profileObj.name || ''
    cadastro.value.email = response.profileObj.email || ''
    cadastro.value.imagem = response.profileObj.imageUrl || ''
  } else if (response && response.credential) {
    // Para Google Identity Services (token JWT)
    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    cadastro.value.nome = payload.name || ''
    cadastro.value.email = payload.email || ''
    cadastro.value.imagem = payload.picture || ''
  }
}

function onGoogleError(error) {
  console.error('Google login error:', error)
}
</script>

<template>
  <div class="usuario-perfil-externo">
    <img src="@/assets/imagens/seta-preta.png" class="seta-voltar-topo" @click="$router.push('/medicamentos')"
      alt="Voltar" />
    <div class="usuario-perfil-card">
      <div class="perfil-foto-area">
        <img :src="usuario.imagem || logo" alt="Foto do usuário" class="foto-usuario" v-if="!cadastrando" />
        <div v-if="!cadastrando" class="perfil-nome-email">
          <div class="usuario-nome">{{ usuario.nome }}</div>
          <div class="usuario-email">{{ usuario.email }}</div>
          <div class="usuario-id">ID: {{ usuario.id }}</div>
        </div>
      </div>
      <form v-if="cadastrando" class="form-cadastro" @submit.prevent="handleCadastro">
        <div class="form-titulo">Cadastro de Usuário</div>
        <label>
          Nome:
          <input v-model="cadastro.nome" type="text" required />
        </label>
        <label>
          E-mail:
          <input v-model="cadastro.email" type="email" required />
        </label>
        <label>
          Senha:
          <input v-model="cadastro.senha" type="password" required />
        </label>
        <label>
          Foto (opcional):
          <input type="file" accept="image/*" @change="handleImagem" />
        </label>
        <div style="display: flex; justify-content: center; margin: 16px 0;">
          <GoogleLogin
            :onSuccess="onGoogleSuccess"
            :onError="onGoogleError"
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      <div v-if="!cadastrando" class="botoes-usuario">
        <button class="btn-logout" @click="deslogar" v-if="!editando">Trocar de usuário</button>
        <button class="btn-editar" @click="iniciarEdicao" v-if="!editando">Editar</button>
      </div>
      <form v-if="editando" class="form-edicao" @submit.prevent="salvarEdicao">
        <div class="form-titulo">Editar Usuário</div>
        <label>
          Nome:
          <input v-model="editarDados.nome" type="text" required />
        </label>
        <label>
          E-mail:
          <input v-model="editarDados.email" type="email" required />
        </label>
        <label>
          Foto (opcional):
          <input type="file" accept="image/*" @change="handleImagemEdicao" />
        </label>
        <button type="submit">Salvar</button>
        <button type="button" @click="editando = false">Cancelar</button>
      </form>
    </div>
  </div>

  <div v-if="showTrocaModal" class="modal">
    <div class="modal-content">
      <h3>Trocar de usuário</h3>
      <button @click="trocarParaUsuarioExistente">Selecionar usuário existente</button>
      <button @click="criarNovoUsuario">Criar novo usuário</button>
    </div>
  </div>

  <div v-if="showSelecionarUsuario" class="modal">
    <div class="modal-content">
      <h3>Selecionar usuário</h3>
      <ul>
        <li v-for="u in usuarios" :key="u.id">
          <div style="display:flex;align-items:center;gap:10px;width:100%">
            <span style="flex:1;display:flex;align-items:center;gap:10px;cursor:pointer" @click="selecionarUsuario(u)">
              <img :src="u.imagem || logo" class="mini-foto" /> {{ u.nome }} ({{ u.email }})
            </span>
            <button @click.stop="excluirUsuario(u.id)"
              style="background:#eee;color:#f4511e;border:none;padding:4px 10px;border-radius:6px;font-size:0.95rem;cursor:pointer;">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.usuario-perfil-externo {
  position: relative;
  max-width: 420px;
  margin: 64px auto 32px auto;
}

.seta-voltar-topo {
  position: fixed;
  top: 24px;
  left: 24px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 100;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px #0002;
  padding: 4px;
  transition: background 0.2s;
}

.seta-voltar-topo:hover {
  background: #f3f6fa;
}

.usuario-perfil-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 24px #0002;
  padding: 36px 32px 28px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  min-width: 320px;
}

.perfil-foto-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  width: 100%;
  justify-content: center;
}

.foto-usuario {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f4511e44;
  background: #f3f6fa;
  box-shadow: 0 2px 8px #f4511e22;
}

.perfil-nome-email {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}

.usuario-nome {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f4511e;
}

.usuario-email {
  font-size: 1.08rem;
  color: #444;
}

.usuario-id {
  font-size: 0.98rem;
  color: #888;
}

.form-cadastro {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 10px;
}

.form-titulo {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f4511e;
  margin-bottom: 8px;
  text-align: center;
}

.form-cadastro label {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #333;
  gap: 4px;
}

.form-cadastro input[type="text"],
.form-cadastro input[type="email"],
.form-cadastro input[type="password"] {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #f3f6fa;
}

.form-cadastro input[type="file"] {
  margin-top: 4px;
}

.form-cadastro button {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.form-cadastro button:hover {
  background: #d84315;
}

.botoes-usuario {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-logout {
  background: #fff;
  color: #f4511e;
  border: 2px solid #f4511e;
  border-radius: 8px;
  padding: 7px 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, color 0.2s;
}

.btn-logout:hover {
  background: #f4511e;
  color: #fff;
}

.btn-editar {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.btn-editar:hover {
  background: #d84315;
}

.form-edicao {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 10px;
}

.form-edicao label {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #333;
  gap: 4px;
}

.form-edicao input[type="text"],
.form-edicao input[type="email"] {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #f3f6fa;
}

.form-edicao input[type="file"] {
  margin-top: 4px;
}

.form-edicao button {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.form-edicao button:hover {
  background: #d84315;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0003;
  text-align: center;
  min-width: 260px;
}

.modal-content h3 {
  margin-bottom: 16px;
  color: #f4511e;
}

.modal-content button {
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin: 8px 4px;
  transition: background 0.2s;
}

.modal-content button:hover {
  background: #d84315;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-content li {
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eee;
}

.modal-content li:last-child {
  border-bottom: none;
}

.modal-content li:hover {
  background: #f3f6fa;
}

.mini-foto {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f4511e44;
  background: #f3f6fa;
}

.perfil-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 18px;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .perfil-container {
    padding: 18px 4vw;
    max-width: 99vw;
  }
}

@media (max-width: 600px) {
  .perfil-container {
    padding: 8px 2vw;
    max-width: 99vw;
  }
}

@media (max-width: 900px) {
  .usuario-perfil-card {
    padding: 24px 4vw 20px 4vw;
    min-width: unset;
    max-width: 98vw;
  }
  .usuario-perfil-externo {
    margin: 48px 0 24px 0;
    max-width: 99vw;
  }
  .perfil-foto-area {
    gap: 10px;
  }
}
@media (max-width: 600px) {
  .usuario-perfil-card {
    padding: 12px 2vw 12px 2vw;
    min-width: unset;
    max-width: 99vw;
  }
  .usuario-perfil-externo {
    margin: 32px 0 16px 0;
    max-width: 100vw;
  }
  .perfil-foto-area {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .foto-usuario {
    width: 70px;
    height: 70px;
  }
  .form-cadastro, .form-edicao {
    gap: 10px;
  }
  .modal-content {
    padding: 14px 2vw;
    min-width: unset;
    max-width: 98vw;
  }
}
@media (max-width: 400px) {
  .usuario-perfil-card {
    padding: 6px 1vw 6px 1vw;
    max-width: 100vw;
  }
  .modal-content {
    padding: 8px 1vw;
    max-width: 100vw;
  }
}

@media (max-width: 600px) {
  .usuario-perfil-card {
    padding: 18px 6vw 18px 6vw;
    min-width: unset;
  }

  .usuario-perfil-externo {
    margin: 64px 0 32px 0;
    max-width: 98vw;
  }
}

@media (max-width: 900px) {
  .form-edicao {
    padding: 8px 2vw;
    max-width: 99vw;
  }
  .form-edicao label {
    font-size: 0.98rem;
  }
  .form-edicao input[type="text"],
  .form-edicao input[type="email"],
  .form-edicao input[type="file"],
  .form-edicao button {
    font-size: 0.98rem;
    padding: 8px 8px;
  }
}
@media (max-width: 600px) {
  .form-edicao {
    padding: 4px 1vw;
    max-width: 99vw;
    gap: 8px;
  }
  .form-edicao label {
    font-size: 0.95rem;
  }
  .form-edicao input[type="text"],
  .form-edicao input[type="email"],
  .form-edicao input[type="file"],
  .form-edicao button {
    font-size: 0.95rem;
    padding: 7px 6px;
  }
}

@media (max-width: 900px) {
  .usuario-perfil-form {
    padding: 12px 2vw;
    max-width: 99vw;
  }
  .usuario-perfil-form label,
  .usuario-perfil-form input,
  .usuario-perfil-form select,
  .usuario-perfil-form button {
    font-size: 0.98rem;
  }
}
@media (max-width: 600px) {
  .usuario-perfil-form {
    padding: 6px 1vw;
    max-width: 99vw;
    gap: 8px;
  }
  .usuario-perfil-form label,
  .usuario-perfil-form input,
  .usuario-perfil-form select,
  .usuario-perfil-form button {
    font-size: 0.95rem;
  }
}
.usuario-perfil-form input,
.usuario-perfil-form select,
.usuario-perfil-form button {
  width: 100%;
  box-sizing: border-box;
}
</style>
