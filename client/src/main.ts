import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { vuetify } from './plugin/vuetify'

const app = createApp(App)

app.use(vuetify)

app.mount('#app')
