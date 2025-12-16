import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? __dirname.split(path.sep).pop() : '/',
    plugins: [vueJsx(), vue(), eslintPlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 21001,
      cors: true,
      strictPort: true,
      open: true,
    },
  };
});
