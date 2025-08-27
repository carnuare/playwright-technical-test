import tseslint from "typescript-eslint"; // Array of configs
import playwright from "eslint-plugin-playwright"; // Array of configs for Playwright

export default [
  {
    ignores: ["node_modules"],
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser
    },
    ...playwright.configs["flat/recommended"],
    ...tseslint.configs.recommended,
  },
];