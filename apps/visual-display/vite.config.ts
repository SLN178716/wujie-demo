import { defineConfig } from 'vite';
import { resolve, sep } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';
import topLevelAwait from 'vite-plugin-top-level-await';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: `/${__dirname.split(sep).pop()}/`,
    plugins: [
      vueJsx(),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('custom-'),
          },
        },
      }),
      eslintPlugin(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: (i) => `__tla_${i}`,
      }),
      mkcert(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 21004,
      host: '0.0.0.0',
      cors: true,
      strictPort: true,
      open: true,
      https: {},
      proxy: {
        '/unpkg-resource': {
          target: 'https://unpkg.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/unpkg-resource/, ''),
        },
      },
    },
  };
});
