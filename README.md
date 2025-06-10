## Cypress QA Demo

This repository contains automated test cases written in Cypress for end-to-end UI and API testing. It serves as a demo project showcasing best practices in test automation using Cypress, including custom commands, environment configurations, and report generation. 
Test plan for reference [View Test Plan](./docs/TestPlan.txt)


## Features

* Automated UI & API testing using Cypress
* Custom commands for reusable login and user creation logic
* Environment-specific test execution
* HTML test reports via Mochawesome
* Easy-to-configure test data and credentials

## Prerequisites

* [Node.js](https://nodejs.org/) (v12 or higher)
* npm (v6 or higher)
* cypress (https://docs.cypress.io/app/get-started/install-cypress)
* A web browser (Electron, Chrome recommended)

---

## Installation 

1. Clone the repository:

   ```bash
   git clone https://github.com/ruchiamgaonkar1/cy_QADemo.git
   cd cy_QADemo
   ```

2. Install dependencies(if any):

   ```bash
   npm install
   ```

---

## Configuration

### Reporter Setup (Mochawesome) [if you want to generate HTML reports]

1. Install the reporter:

   ```bash
   npm i --save-dev cypress-mochawesome-reporter
   ```

2. Add the reporter configuration in `cypress.config.js`:

   ```js
   const { defineConfig } = require('cypress');

   module.exports = defineConfig({
     reporter: 'cypress-mochawesome-reporter',
     reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: false,
      reportPageTitle: 'custom-title',
      embeddedScreenshots: false,
    },
     e2e: {
       setupNodeEvents(on, config) {
         require('cypress-mochawesome-reporter/plugin')(on);
       },
     },
   });
   ```

3. Import the reporter in `cypress/support/e2e.js`:

   ```js
   import 'cypress-mochawesome-reporter/register';
   ```

---

## Custom Commands

Custom commands are defined in `cypress/support/commands.js` and extend Cypress functionality.

### Examples:

* **Login Command**

  ```js
  cy.login(username, password);
  cy.login(username, password, true); // true for API login
  ```

* **Create User Command**

  ```js
  cy.getCustomerIdFromDirectLogin(username, password);
  ```

---

## Environment Variables

Manage environment settings in:

* `cypress.env.json`
* `cypress.config.js`

---

## Running Tests

### Method 1: Using Cypress UI

```bash
npx cypress open
```

* Select "E2E Testing"
* Choose a browser
* Pick a test to run

### Method 2: Headless Mode (Terminal)

```bash
npx cypress run --headless --reporter mochawesome --reporter-options reportDir="cypress/results/"
```

---

## Test Scenarios

### 1. New User Registration Test

* **Purpose:** Validate registration flow
* **Data file:** `lastCreatedUser.json`
* **Default Test User:**

  ```json
  {
    "username": "john",
    "password": "demo"
  }
  ```

### 2. User Login Test

* **Purpose:** Validate login functionality
* **Dependency:** Reads from `lastCreatedUser.json`
* **Details:** Uses most recent credentials to verify login

---

## Reports

* Reports are generated in `cypress/results`
* HTML Report includes:

  * Test summaries
  * Step-by-step execution
  * Screenshots (if configured)

---

## Troubleshooting

* Ensure dependencies are installed (`npm install`)
* Check if `cypress/results` directory exists
* Verify browser compatibility
* Review terminal or Cypress UI logs for errors
* Ensure environment variables are properly configured
* Confirm all custom commands are correctly imported

---
## Future Goals

Planned improvements and upcoming features:

- Extend test coverage to negative scenarios and edge cases
- Add support for multiple environments and dynamic test data
- Integrate API contract testing using Postman or Swagger
- Refactor and modularize reusable functions and commands
- Enhance reporting capabilities with additional metrics and insights
- Explore integration with CI/CD pipelines for continuous testing and deployment, tag based execution.


