import baseConfig, { baseVueConfig } from '@packages/eslint';
import globals from 'globals';

export default [
  ...baseConfig,
  ...baseVueConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
