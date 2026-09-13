import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { setupMocks } from './mocks'
import './style.css'
import App from './App.vue'

// Initialize API mocks if enabled
setupMocks()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
