# Playwright Technical Test

This is a test suite built with Playwright and TS, designed to validate key functionalities of the DemoQA website. The test suite is structured to showcase various automation capabilities, including end-to-end UI flows, concurrent multi-user interactions, and direct API consumption.

### Prerequisites

To run this project, you need the following installed:

* **Node.js:** Runtime environment. Version 24 or later. You can find installation instructions on the official Node.js website [here](https://nodejs.org/en/download/).
* **pnpm:** Package manager. Version 10 or later. Instructions for installing pnpm can be found [here](https://pnpm.io/installation).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/playwright-technical-test.git
    cd playwright-technical-test
    ```

2.  Install the project dependencies and Playwright's browsers:
    ```bash
    pnpm install
    pnpm playwright install --with-deps
    ```

### Running the Tests

The project includes several pre-configured scripts to make test execution easy.

* **Run All Tests:** Launches all tests from both the `tests/api` and `tests/ui` directories.
    ```bash
    pnpm test
    ```

* **Run API Tests Only:** Executes only the API tests without launching a browser.
    ```bash
    pnpm test-api
    ```

* **Run UI Tests Only:** Executes only the UI tests against both Chromium and Firefox browsers.
    ```bash
    pnpm test-ui
    ```
* **View Test Report:** Opens the latest HTML report generated after test execution.
    ```bash
    pnpm test-report
    ```

### Other Commands

* **Linting:** Runs ESLint to check for code style and potential errors.
    ```bash
    pnpm lint
    ```

* **Type Checking:** Verifies the TypeScript code for type errors.
    ```bash
    pnpm typecheck
    ```