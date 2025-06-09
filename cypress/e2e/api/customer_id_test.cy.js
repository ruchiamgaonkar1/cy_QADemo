/// <reference types="cypress" />

describe('Customer ID and Account Creation Test', () => {
    beforeEach(() => {
        cy.fixture('lastCreatedUser').as('user');
        // Load saved state if it exists
        cy.fixture('testState').then((state) => {
            if (state.customerId) {
                Cypress.env('customerId', state.customerId);
            }
        });
    });

    it('should get customer ID using direct login', function() {
        cy.getCustomerIdFromDirectLogin(this.user.username, this.user.password)
            .then((id) => {
                expect(id).to.not.be.null;
                expect(id).to.match(/^\d+$/); // Should be numeric
                
                // Verify we can get customer details
                return cy.fixture('config').then((config) => {
                    return cy.request({
                        method: 'GET',
                        url: `${config.baseUrl}/services/bank/customers/${id}`,
                        headers: {
                            'accept': 'application/json'
                        },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property('id', parseInt(id));
                        cy.log('Customer details:', JSON.stringify(response.body));
                    });
                });
            });
    });

}); 