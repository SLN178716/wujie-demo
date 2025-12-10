import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), eslintPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/style/mixin.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 21003,
    cors: true,
    strictPort: true,
    open: true,
  },
});
