/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import drizzle from "eslint-plugin-drizzle";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  { ignores: ["dist/", "_static/"] },
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
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^[_ce(evt)f(ws)]",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^[_k(key)]",
          ignoreRestSiblings: true,
        },
      ],
      ...drizzle.configs.recommended.rules,
      "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: "db" }],
    },
  },
  eslintConfigPrettier
);
