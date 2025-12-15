import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: __dirname.split(path.sep).pop(),
  plugins: [react(), eslintPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 21000,
    cors: true,
    strictPort: true,
    open: true,
  },
});
