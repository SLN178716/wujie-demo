import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import minifyHtml from 'rollup-plugin-minify-html-literals';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';

const pluginMinifyHtmlLiterals = minifyHtml.default;
export default defineConfig(({ mode }) => {
  const prod = mode === 'production';
  return {
    plugins: [
      eslintPlugin(),
      dts({
        // 打包生成ts声明文件
        insertTypesEntry: true, // 在 package.json 中插入 types 字段
        rollupTypes: true, // 使用 Rollup 打包类型
        noEmitOnError: true, // 有错误时不输出
        clearPureImport: true, // 清理纯导入
        skipDiagnostics: false, // 显示诊断信息
        logDiagnostics: true, // 输出诊断日志
      }),
    ],
    css: {
      postcss: 'postcss.config.js',
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: !prod,
      lib: {
        name: '@packages/pdf-view',
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${{ es: 'm', cjs: 'c' }[format] || ''}js`,
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      rollupOptions: {
        plugins: [pluginMinifyHtmlLiterals(), postcss(), postcssLit()],
      },
      watch: prod ? null : {},
    },
  };
});
