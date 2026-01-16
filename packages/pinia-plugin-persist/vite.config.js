import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const prod = mode === 'production';
  return {
    plugins: [
      eslintPlugin(),
      dts({
        insertTypesEntry: true, // 在 package.json 中插入 types 字段
        rollupTypes: true, // 使用 Rollup 打包类型
        noEmitOnError: true, // 有错误时不输出
        clearPureImport: true, // 清理纯导入
        skipDiagnostics: false, // 显示诊断信息
        logDiagnostics: true, // 输出诊断日志
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: !prod,
      lib: {
        name: '@packages/pinia-plugin-persist',
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${{ es: 'm', cjs: 'c' }[format] || ''}js`,
      },
      rollupOptions: {
        // 外部化依赖，不打包进库
        external: ['pinia'],
        output: {
          globals: {
            pinia: 'pinia',
          },
        },
      },
      watch: prod ? null : {},
    },
  };
});
