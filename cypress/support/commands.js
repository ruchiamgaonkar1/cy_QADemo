// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ***********************************************
// Custom Commands for Parabank Application
// ***********************************************

import { generateCredentials, saveCredentials } from './utilities';

/**
 * Navigate to login page and verify elements
 * @example
 * cy.navigateToLogin()
 */
Cypress.Commands.add('navigateToLogin', () => {
    cy.fixture('config').then((config) => {
        // Navigate to base URL
        cy.visit(`${config.baseUrl}/index.htm`);
        
        // Verify login form elements are present
        cy.get('input[name="username"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[value="Log In"]').should('be.visible');
    });
});

/**
 * Login with provided credentials
 * Can be used for both UI and API login
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @param {boolean} useApi - Whether to use API for login (default: false)
 * @example
 * cy.login('testuser', 'testpass') // UI login
 * cy.login('testuser', 'testpass', true) // API login
 */
Cypress.Commands.add('login', (username, password, useApi = false) => {
    // Store credentials for later use
    Cypress.env('username', username);
    Cypress.env('password', password);
    cy.log('Attempting login for user:', username);

    if (useApi) {
        // API Login
        return cy.fixture('config').then((config) => {
            cy.request({
                method: 'POST',
                url: `${config.baseUrl}/login.htm`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: {
                    username: username,
                    password: password
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('API Login Response:', response.status);
                expect(response.status).to.eq(200);
                return cy.wrap(response);
            });
        });
    } else {
        // UI Login
        cy.navigateToLogin();
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);
        cy.get('input[value="Log In"]').click();
        cy.wait(1000); // Wait for login process
        
        // // Get customer ID after successful login
        // return cy.getCustomerId();
    }
});

/**
 * Logout from the application
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
    cy.get('a[href="logout.htm"]').click();
    cy.wait(500);
});

/**
 * Register a new user with provided user data
 * @param {Object} userData - User data from fixture
 * @param {Object} options - Options for credential generation
 * @returns {Object} Generated credentials
 * @example
 * cy.registerUser(this.userData).then(credentials => {
 *   // use credentials.username and credentials.password
 * })
 */
Cypress.Commands.add('registerUser', (userData, options = {}) => {
    // Generate and save credentials
    const credentials = generateCredentials(options);
    saveCredentials(credentials);

    // Navigate to registration page
    cy.fixture('config').then((config) => {
        cy.visit(`${config.baseUrl}/register.htm`);
    });

    // Fill registration form
    cy.get('input[name="customer\\.firstName"]').type(userData.firstName);
    cy.get('input[name="customer\\.lastName"]').type(userData.lastName);
    cy.get('input[name="customer\\.address\\.street"]').type(userData.address);
    cy.get('input[name="customer\\.address\\.city"]').type(userData.city);
    cy.get('input[name="customer\\.address\\.state"]').type(userData.state);
    cy.get('input[name="customer\\.address\\.zipCode"]').type(userData.zipCode);
    cy.get('input[name="customer\\.phoneNumber"]').type(userData.phone);
    cy.get('input[name="customer\\.ssn"]').type(userData.ssn);
    cy.get('input[name="customer\\.username"]').type(credentials.username);
    cy.get('input[name="customer\\.password"]').type(credentials.password);
    cy.get('input[name="repeatedPassword"]').type(credentials.password);

    // Submit form and verify success
    cy.get('input[value=Register]').click();
    cy.contains('Welcome ' + credentials.username).should('be.visible');
    cy.contains('Your account was created successfully. You are now logged in.').should('be.visible');

    return cy.wrap(credentials);
});

/**
 * Get customer ID using direct login URL
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Cypress.Chainable<string>} Promise resolving to customer ID
 */
Cypress.Commands.add('getCustomerIdFromDirectLogin', (username, password) => {
    return cy.fixture('config').then((config) => {
        cy.log('Getting customer ID for:', username);
        
        return cy.request({
            method: 'GET',
            url: `${config.baseUrl}/services/bank/login/${username}/${password}`,
            headers: {
                'accept': 'application/json'
            },
            failOnStatusCode: false
        }).then((response) => {
            cy.log('Direct Login Response:', response.status, response.body);
            
            if (response.status === 200) {
                // Validate response body exists
                if (!response.body) {
                    const errorMsg = 'Login successful but received empty response body';
                    cy.log(errorMsg);
                    throw new Error(errorMsg);
                }

                // Extract and validate customer ID
                const customerId = response.body.id;
                if (!customerId) {
                    const errorMsg = 'Login successful but customer ID is missing from response';
                    cy.log(errorMsg);
                    throw new Error(errorMsg);
                }

                cy.log('Successfully retrieved customer ID:', customerId);
                
                // Store customer ID in Cypress environment
                Cypress.env('customerId', customerId);
                
                // Update test state in fixture file
                cy.readFile('cypress/fixtures/testState.json').then((state) => {
                    const updatedState = {
                        ...state,
                        customerId,
                        lastLoginResponse: response.body,
                        lastTestRun: new Date().toISOString()
                    };
                    return cy.writeFile('cypress/fixtures/testState.json', updatedState);
                });
                
                return cy.wrap(customerId);
            }

            // Handle non-200 status codes
            const errorMsg = `Login failed with status ${response.status}: ${JSON.stringify(response.body)}`;
            cy.log(errorMsg);
            throw new Error(errorMsg);
        });
    });
});
