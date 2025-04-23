import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueZodForm',
      fileName: (format) => `vue-zod-form.${format}.js`,
    },
    rollupOptions: {},
  },
})
