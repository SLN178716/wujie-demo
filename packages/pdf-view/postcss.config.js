import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';

export default {
  syntax: 'postcss-lit',
  plugins: [
    postcssImport(),
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
};
