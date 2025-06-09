/**
 * Navigation related Cypress commands
 */

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

export {}; 