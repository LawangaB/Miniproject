import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // This now finds your new folder!
import './assets/main.css'

const app = createApp(App)

app.use(router) // This is the "magic" line
app.mount('#app')