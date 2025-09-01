import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default [
  {
    ignores: ["node_modules", "playwright-report*"],
  },
  ...tseslint.configs.recommended,
  playwright.configs["flat/recommended"],
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
];
