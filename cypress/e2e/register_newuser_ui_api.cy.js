/// <reference types="cypress" />
describe('Parabank - Register New User', () => {
    beforeEach(() => {
        // Load test data and configuration
        cy.fixture('newUserData').as('userData');
        cy.fixture('config').as('config');
    });
  
    it('should register a new user successfully', function () {
        // Register new user using custom command
        cy.registerUser(this.userData, {
            usernamePrefix: this.userData.usernamePrefix,
            passwordPrefix: this.userData.password
        }).then(credentials => {
            // Logout after successful registration
            cy.logout();

            // Validate registration via API
            cy.log(`Validating user login via API: ${this.config.baseUrl}/login.htm`);
            cy.request({
                method: 'POST',
                url: `${this.config.baseUrl}/login.htm`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: {
                    username: credentials.username,
                    password: credentials.password
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);
                
            });
        });
    });
});