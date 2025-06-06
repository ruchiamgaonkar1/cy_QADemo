/**
 * Login Validation Test Suite for Parabank
 * This test suite validates various login scenarios through the UI
 * 
 * Key features tested:
 * - Positive login with valid credentials
 * - Negative scenarios with invalid credentials
 * - Edge cases like empty credentials and missing password
 */

/// <reference types="cypress" />

describe('Login Validation UI', () => {
    beforeEach(() => {
        // Load test data and configuration
        cy.fixture('config').as('config');
        cy.fixture('lastCreatedUser').as('lastUser');
        cy.fixture('negativeLoginData').as('negativeData');
      
    });

    // Positive test scenario - successful login
    it('should login with valid credentials', function() {
        // Use custom command for login
        cy.login(this.lastUser.username, this.lastUser.password);
        
        // Logout using custom command
        cy.logout();
    });

    // Negative test scenarios - testing invalid login attempts
    it('should handle invalid login attempts', function() {
        // Get scenarios from fixture
        this.negativeData.scenarios.forEach((scenario) => {
            // Use custom command to navigate to login page
            cy.navigateToLogin();
            cy.log('Testing invalid login:', scenario.description);
            
            // Enter invalid credentials
            cy.get('input[name="username"]').type(scenario.username);
            cy.get('input[name="password"]').type(scenario.password);
            
            // Submit login and verify error
            cy.get('input[value="Log In"]').click();
            cy.wait(200)  // Wait for error message
            
            // Verify the specific error message for this scenario
            cy.get('.error')
              .should('be.visible')
              .and('contain', scenario.expectedError);
        });
    });
});
