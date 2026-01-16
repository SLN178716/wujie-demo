import baseConfig from '@packages/eslint';
import globals from 'globals';

export default [
  ...baseConfig,
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
