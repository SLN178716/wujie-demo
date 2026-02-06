import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import babel from 'vite-plugin-babel';
// import minifyHtml from 'rollup-plugin-minify-html-literals';

// const pluginMinifyHtmlLiterals = minifyHtml.default;
export default defineConfig(({ mode }) => {
  const prod = mode === 'production';
  return {
    plugins: [
      eslintPlugin(),
      babel({
        babelConfig: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              'template-html-minifier',
              {
                modules: {
                  'lit-html': ['html'],
                  'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                  'lit/directives/ref.js': ['ref', 'createRef'],
                },
                strictCSS: true,
                htmlMinifier: {
                  collapseWhitespace: true,
                  conservativeCollapse: true,
                  collapseBooleanAttributes: false,
                  removeComments: false,
                  caseSensitive: true,
                  minifyCSS: true,
                },
              },
            ],
          ],
        },
      }),
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
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'es2015',
      sourcemap: true,
      lib: {
        name: '@packages/pdf-view',
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${{ es: 'm', cjs: 'c' }[format] || ''}js`,
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      minify: prod ? 'terser' : 'esbuild',
      terserOptions: {
        compress: {
          // 基础优化
          defaults: true, // 使用默认压缩选项
          dead_code: true, // 移除死代码
          conditionals: true, // 优化条件语句
          booleans: true, // 优化布尔值
          unused: true, // 移除未使用的变量
          if_return: true, // 优化 if-return
          join_vars: true, // 合并变量声明
          drop_console: true, // 删除 console
          drop_debugger: true, // 始终删除 debugger

          // 高级优化
          comparisons: true, // 优化比较运算
          collapse_vars: true, // 内联变量
          reduce_vars: true, // 减少变量
          loops: true, // 优化循环
          toplevel: true, // 顶级作用域优化
          side_effects: true, // 移除无副作用的表达式
          sequences: true, // 使用逗号操作符
          switches: true, // 优化 switch
          passes: 3, // 压缩遍数

          // 特定函数处理
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.table'],

          // 类型转换优化
          typeofs: true,

          // 字符串处理
          evaluate: true, // 计算常量表达式
          inline: true, // 内联小函数

          // 安全优化
          keep_fargs: false, // 不保留函数参数名
          keep_fnames: false, // 不保留函数名（对类方法有影响）
          keep_infinity: true, // 保留 Infinity（避免 iOS 问题）

          // 数字处理
          reduce_funcs: true, // 减少函数
          unsafe: false, // 不使用不安全优化
          unsafe_math: false, // 不使用不安全的数学优化
          unsafe_methods: false, // 不使用不安全的方法调用
          unsafe_proto: false, // 不使用不安全的原型操作
          unsafe_regexp: false, // 不使用不安全的正则
          unsafe_undefined: true, // 安全的 undefined 替换
        },

        // 混淆选项
        mangle: {
          safari10: true, // 兼容 Safari 10
          keep_classnames: false, // 不保留类名
          keep_fnames: false, // 不保留函数名
          properties: {
            regex: /^_/, // 混淆以下划线开头的属性
            keep_quoted: true, // 保留引号属性
          },
          toplevel: true, // 顶级作用域混淆
          reserved: [
            // 保留的关键字
            'require',
            'exports',
            'module',
            'Promise',
            'Set',
            'Map',
            'Symbol',
            'Array',
            'Object',
            'String',
            'Number',
            'Boolean',
            'Function',
            'RegExp',
            'Date',
            'Error',
            'Math',
            'JSON',
            'console',
            'window',
            'document',
            'navigator',
            'localStorage',
            'sessionStorage',
          ],
        },

        // 格式化选项
        format: {
          comments: true, // 移除注释
          beautify: true, // 不美化输出
          indent_level: 2, // 缩进级别
          quote_style: 3, // 引号风格：3=保持原样
          preamble: null, // 文件头注释
          max_line_len: 80, // 最大行长度
          ecma: 2020, // ECMAScript 版本
          wrap_iife: true, // 包装立即执行函数
          keep_numbers: false, // 不保留数字字面量
          keep_quoted_props: true, // 保留引号属性
          ascii_only: false, // 只使用 ASCII 字符
        },

        // 其他选项
        sourceMap: true,

        ecma: 2020, // 输出 ECMAScript 版本
        ie8: false, // 不支持 IE8
        module: true, // ES 模块
        toplevel: true, // 顶级作用域优化
        nameCache: null, // 名称缓存（可用于增量构建）
      },
      rollupOptions: {
        external: (id) => {
          const externalPatterns = [/^pdfjs-dist(\/|$)/, /^lit(\/|$)/];
          return externalPatterns.some((pattern) => pattern.test(id));
        },
        output: {
          globals: {
            'pdfjs-dist': 'pdfjsLib',
            'pdfjs-dist/web/pdf_viewer.mjs': 'pdfjsViewer',
            lit: 'Lit',
            'lit/directives/ref.js': 'LitRefDirective',
          },
        },
        plugins: [
          // pluginMinifyHtmlLiterals({
          //   failOnError: true,
          //   options: {
          //     minifyOptions: {
          //       removeComments: true,
          //       collapseWhitespace: true,
          //       minifyCSS: true,
          //     },
          //   },
          // }),
        ],
      },
      watch: prod ? null : {},
    },
  };
});
