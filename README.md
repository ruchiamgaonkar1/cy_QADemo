# Cypress QA Demo

This project contains automated test cases using Cypress for QA testing purposes.

## Prerequisites
- Node.js (v12 or higher)
- npm (v6 or higher)
- A modern web browser (Chrome recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cy_QADemo
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Reporter Setup
1. Install mochawesome reporter:
```bash
npm i --save-dev cypress-mochawesome-reporter
```

2. Configure reporter in `cypress.config.js`:
```javascript
const { defineConfig } = require('cypress')
module.exports = defineConfig({
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'cypress/results',
        overwrite: false,
        html: true,
        json: false,
        reportPageTitle: 'custom-title',
        embeddedScreenshots: false,
    },
})
```

3. Import reporter in `support/e2e.js`:
```javascript
import 'cypress-mochawesome-reporter/register';
```

## Custom Commands

Custom commands are defined in `cypress/support/commands.js`. These commands extend Cypress's functionality for our specific testing needs.

### Available Commands
Example:
1. **Login Command**
```javascript
// Usage: cy.login(username, password)
// Usage: cy.login(username, password, true) // true to verify login via api
```

2. **Create User Command**
```javascript
// Usage: cy.getCustomerIdFromDirectLogin(username, password)
```

## Environment Variables

Environment variables are managed through `cypress.env.json` and `cypress.config.js`.
These variables help configure test behavior across different environments.

### Configuration Files

1. Create `cypress.env.json` in the project root:
```json
{
    "customerId": null,
    "username": null,
    "password": null,
    "lastLoginResponse": null
}
```

2. Update `cypress.config.js`:
```javascript
const { defineConfig } = require('cypress')
module.exports = defineConfig({
    env: {
        ...
    },
    // ... other config options
})
```

### Running with Different Environments
```bash
# Run tests with production environment
npx cypress run --env environment=production

# Run tests with staging environment
npx cypress run --env environment=staging
```

## Running Tests

### Method 1: Using Cypress UI
1. Launch Cypress Test Runner:
```bash
npx cypress open
```
2. Select E2E Testing
3. Choose your preferred browser
4. Select the test file to run
5. View test execution in real-time

### Method 2: Headless Mode (Terminal)
```bash
npx cypress run --headless --reporter mochawesome --reporter-options reportDir="cypress/results/"
```

## Test Scenarios

### 1. New User Registration Test
- **Purpose**: Validates the user registration flow
- **File**: `lastCreatedUser.json` is updated with new user details
- **Default Test Data can be used as in  `lastCreatedUser.json`**:
```json
{
    "username": "john",
    "password": "demo"
}
```

### 2. User Login Test
- **Purpose**: Validates the login functionality
- **Dependencies**: Uses credentials from `lastCreatedUser.json`
- **Behavior**: Authenticates using the most recently created user credentials

## Reports
- Reports are generated in the `cypress/results` folder for terminal execution
- HTML reports include:
  - Test execution summary
  - Step-by-step test details


## Troubleshooting
- Ensure all dependencies are properly installed
- Check if `cypress/results` directory exists
- Verify browser compatibility
- Review console logs for any error messages
- Check environment variables are properly set
- Verify custom commands are properly imported
    
