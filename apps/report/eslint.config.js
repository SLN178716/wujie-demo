import baseConfig from "@packages/eslint";
import globals from "globals";

export default [
  ...baseConfig,
  {
    ignores: ["vite.config.js"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
