/**
 * Customer related Cypress commands
 */

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

export {}; 