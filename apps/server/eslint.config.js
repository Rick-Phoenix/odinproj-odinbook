/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import drizzle from "eslint-plugin-drizzle";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  { ignores: ["dist/"] },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    plugins: { drizzle },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      ...drizzle.configs.recommended.rules,
    },
  },
  eslintConfigPrettier
);
