#   Playwright Technical Test
  

Run the end-to-end tests:

    pnpm exec playwright test

Start the interactive UI mode:

    pnpm exec playwright test --ui

Run the tests only on Desktop Chrome:

    pnpm exec playwright test --project=chromium

Run the tests in a specific file:

    pnpm exec playwright test example

Run the tests in debug mode:

    pnpm exec playwright test --debug

Auto generate tests with Codegen:

    pnpm exec playwright codegen