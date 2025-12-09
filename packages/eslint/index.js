import jseslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,vue}"] },
  {
    ignores: ["node_modules", "dist", "public", ".vscode", ".husky"],
  },
  jseslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "no-console": "warn",
    },
  },
];
