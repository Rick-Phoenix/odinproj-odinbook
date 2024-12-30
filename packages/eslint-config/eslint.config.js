import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  { ignores: ["dist/"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.es2020 },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  eslintConfigPrettier
);
