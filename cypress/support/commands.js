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
                expect(response.status).to.eq(200);
                return response;
            });
        });
    } else {
        // UI Login
        cy.navigateToLogin();
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);
        cy.get('input[value="Log In"]').click();
        cy.wait(500); // Wait for login process
    }
});

/**
 * Logout from the application
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
    cy.get('a[href="logout.htm"]').click();
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