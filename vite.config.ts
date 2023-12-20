import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@data': fileURLToPath(new URL('./src/dataStore', import.meta.url))
    }
  },
  server: {
    proxy: {
      "/socket.io": {
        target: "ws://localhost:33333",
        ws: true,
      },
    }
  }
})
