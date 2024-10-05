import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~styles': resolve(__dirname, './src/assets/styles'),
      '~fonts': resolve(__dirname, './public/fonts'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'src/index.html',
      },
    },
  },
  plugins: [
    vue(),
    crx({ manifest }),
  ],
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vue-i18n',
    ]
  },
});
