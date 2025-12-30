import { defineConfig } from 'vite';
import { resolve, sep } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-expect-error: 暂无解决
import eslintPlugin from 'vite-plugin-eslint';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: `/${__dirname.split(sep).pop()}/`,
    plugins: [vueJsx(), vue(), eslintPlugin()],
    css: {
      postcss: {
        // 直接配置插件（覆盖 postcss.config.js）
        plugins: [
          autoprefixer(),
          postcssPresetEnv({
            stage: 3, // 启用的CSS阶段（0-4），默认=2
            features: {
              // 精确控制特性开关
              'nesting-rules': true, // 启用嵌套规则（&语法）
              'custom-media-queries': true, // 允许CSS媒体查询变量
            },
          }),
        ],
      },
    },
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
