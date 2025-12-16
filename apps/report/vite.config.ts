import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? __dirname.split(path.sep).pop() : '/',
    plugins: [
      react(),
      eslintPlugin(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: (i) => `__tla_${i}`,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 21002,
      cors: true,
      strictPort: true,
      open: true,
    },
  };
});
