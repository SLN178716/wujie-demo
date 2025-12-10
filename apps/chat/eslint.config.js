import baseConfig, { baseVueConfig } from '@packages/eslint';
import globals from 'globals';

export default [
  ...baseConfig,
  ...baseVueConfig,
  {
    ignores: ['vite.config.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
