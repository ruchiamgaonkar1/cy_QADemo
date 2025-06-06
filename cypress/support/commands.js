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
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @example
 * cy.login('testuser', 'testpass')
 */
Cypress.Commands.add('login', (username, password) => {
    cy.navigateToLogin();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[value="Log In"]').click();
    cy.wait(500); // Wait for login process
});

/**
 * Logout from the application
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
    cy.get('a[href="logout.htm"]').click();
});