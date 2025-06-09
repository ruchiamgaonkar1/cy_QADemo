/**
 * Registration related Cypress commands
 */

import { generateCredentials, saveCredentials } from '../utilities';

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

export {}; 