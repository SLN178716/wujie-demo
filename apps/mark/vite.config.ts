import { defineConfig } from 'vite';
import { resolve, sep } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: `/${__dirname.split(sep).pop()}/`,
    plugins: [
      vue(),
      vueJsx(),
      eslintPlugin(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: (i) => `__tla_${i}`,
      }),
    ],
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
  };
});
