import { defineConfig } from 'vite';
import { resolve, sep } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: `/${__dirname.split(sep).pop()}/`,
    plugins: [vueJsx(), vue(), eslintPlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 21005,
      cors: true,
      strictPort: true,
      open: true,
    },
  };
});
