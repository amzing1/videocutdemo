import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), mkcert()],
  server: {
    https: {},
    host: true, // 或者设置为 '0.0.0.0'，允许局域网访问
    port: 5173,
    headers: {
      // 必须开启，否则 OPFS 和 WebCodecs 性能受限
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  
})
