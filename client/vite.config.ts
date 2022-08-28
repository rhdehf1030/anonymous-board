import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  server: {
    port: 3100
  },
  plugins: [
    vue(),
    Vuetify({
      autoImport: true,
      styles: true
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
