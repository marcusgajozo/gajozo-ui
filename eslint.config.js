import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import jsxA11y from "eslint-plugin-jsx-a11y";

const localPlugin = {
  rules: {
    "no-comments": {
      create(context) {
        return {
          Program() {
            const sourceCode = context.sourceCode || context.getSourceCode();
            const comments = sourceCode.getAllComments();
            comments.forEach((comment) => {
              const text = comment.value.trim();
              if (
                text.startsWith("eslint") ||
                text.startsWith("TODO") ||
                text.includes("TODO") ||
                text.startsWith("/")
              )
                return;
              context.report({
                loc: comment.loc,
                message: "Comentários no código geram um aviso.",
              });
            });
          },
        };
      },
    },
  },
};

export default defineConfig([
  globalIgnores(["dist", "storybook-static"]),
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      local: localPlugin,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
      "no-console": "error",
      "local/no-comments": "warn",
      "react-refresh/only-export-components": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
]);
