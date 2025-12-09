import baseConfig from '@packages/eslint';
import globals from 'globals';
import eslintPluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  ...baseConfig,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 在这里追加 Vue 规则
      'vue/no-mutating-props': [
        'error',
        {
          shallowOnly: true,
        },
      ],
    },
  },
];
