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
    echo 'All UI tests'
    pnpm test-ui
    echo 'Register and Login flow test'
    pnpm test-ui-flow
    echo 'Concurrent users test'
    pnpm test-ui-concurrent
    ```
* **View Test Report:** Opens the latest HTML report generated after test execution.
    ```bash
    pnpm test-report
    ```
NOTE: When running locally, tests automatically run in headed mode. To run in headless mode, export the CI variable to true before each test.


    echo 'Run all tests in headless mode'
    CI=true pnpm test


### Other Commands

* **Linting:** Runs ESLint to check for code style and potential errors.
    ```bash
    pnpm lint
    ```

* **Type Checking:** Verifies the TypeScript code for type errors.
    ```bash
    pnpm typecheck
    ```

## Test Scenarios

### 1. UI Flow
- Register a user on DemoQA (via API or UI).  
- Log in with the new user and verify the profile page loads correctly.  

### 2. Multi-user
- Simulate **two users in parallel** using `browser.newContext()`.  
- **User A** navigates to [Practice Form](https://demoqa.com/automation-practice-form) and fills it out.  
- **User B** navigates to [Sortable Grid](https://demoqa.com/sortable) and reorders the items.  

### 3. API Testing
- Consume the [Books API](https://demoqa.com/swagger/) to retrieve all books.  
- Creates an user and generates a token to authorize further API requests.  
- Add a new book for the user via the API.  
- Validate the **status codes** and **response structure** using TypeScript.  