import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,vue}"] },
  {
    ignores: [
      "node_modules",
      "dist",
      "public",
      ".vscode",
      ".husky",
      ".github",
      "**/mock/*",
    ],
  },
  jseslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  // {
  //   rules: {
  //     "no-console": "warn",
  //   },
  // },
];

const baseVueConfig = [
  ...eslintPluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 在这里追加 Vue 规则
      "vue/no-mutating-props": [
        "error",
        {
          shallowOnly: true,
        },
      ],
      "vue/max-attributes-per-line": [
        "warn",
        {
          singleline: 10,
        },
      ],
      "vue/singleline-html-element-content-newline": "off",
    },
  },
];

export { baseVueConfig };
