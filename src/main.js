import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './assets/Router/router'
import GoogleLogin from 'vue3-google-login'

const app = createApp(App)
app.use(router)
app.use(GoogleLogin, {
  clientId: '829560164695-o8ota27seaf1oa4clcg7841slusndn7u.apps.googleusercontent.com'
})
app.mount('#app')
