import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-compiler": reactCompiler,
    },
    settings: { react: { version: "19.0" } },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        jsxPragma: null,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/only-throw-error": "off",
    },
  },
  ...pluginQuery.configs["flat/recommended"],
  ...pluginRouter.configs["flat/recommended"],
  eslintConfigPrettier
);
