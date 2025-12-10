import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vueJsx(), vue(), eslintPlugin()],
  resolve: {
    alias: {
      // 路径别名
      '@': resolve(__dirname, 'src'),
    },
  },
});
