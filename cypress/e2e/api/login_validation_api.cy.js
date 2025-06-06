/// <reference types="cypress" />

describe('Login Validation via API', () => {
    beforeEach(() => {
        cy.fixture('config').as('config');
        cy.fixture('lastCreatedUser').as('lastUser');
        cy.fixture('negativeLoginData').as('negativeData');
    }); 

    it('should login via API', function () { 
        cy.log('Testing API login with valid credentials');
        // Using the updated login command with API flag
        cy.login(this.lastUser.username, this.lastUser.password, true)
            .then((response) => {
                expect(response.status).to.eq(200);
            });
    });

    // Negative test scenarios using fixture data
    it('should handle negative login scenarios', function() {
        // Get scenarios from fixture and test each one
        this.negativeData.scenarios.forEach((scenario) => {
            cy.log(`Testing API login with: ${scenario.description}`);
            cy.request({
                method: 'POST',
                url: `${this.config.baseUrl}/login.htm`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: { 
                    username: scenario.username, 
                    password: scenario.password 
                },
                failOnStatusCode: false
            }).then((response) => {
                // Verify unauthorized status
                expect(response.status).to.eq(200);
                expect(response.body).to.include("The username and password could not be verified.");
              });
        });
    });
});
