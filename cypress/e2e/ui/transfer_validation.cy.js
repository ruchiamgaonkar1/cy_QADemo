//cypress/e2e/register_newuser_ui_api.cy.js

/// <reference types="cypress" />

/**
 * End-to-End Test Suite for Parabank Fund Transfer Functionality
 * Tests both positive and negative scenarios for fund transfers
 */
describe('Parabank - End-to-End UI Workflow (Login via UI + Fund Transfer)', () => {
    let testCredentials;  // Variable to store credentials between tests
    
    beforeEach(() => {
      // Load test data from fixtures
      cy.fixture('config').as('config');
      cy.fixture('newUserData').as('userData');
      cy.fixture('negativeFundTransferData').as('negativeData');
    });
  
    // Positive test scenario - successful fund transfer
    it('should register new user', function () {
      // Register new user using custom command
      cy.registerUser(this.userData, {
        usernamePrefix: this.userData.usernamePrefix,
        passwordPrefix: this.userData.password
        }).then(credentials => {
        // Store credentials for subsequent tests
        testCredentials = credentials;
        cy.log('Created new user with credentials:', JSON.stringify(credentials));
        // Verify lastCreatedUser.json was updated
        cy.readFile('cypress/fixtures/lastCreatedUser.json').then(savedCreds => {
          cy.log('Saved credentials:', JSON.stringify(savedCreds));
          expect(savedCreds).to.have.property('username');
          expect(savedCreds).to.have.property('password');
        });
        // Logout after successful registration
        cy.logout();
      })
    });
    
    // Positive test scenario - successful fund transfer
    it('should login via UI, perform fund transfer, and verify transaction', function () {
      expect(testCredentials, 'No test credentials available - registration test must run first').to.exist;
      cy.log('Attempting login with:', JSON.stringify(testCredentials));
      
      cy.login(testCredentials.username, testCredentials.password);
      
      // Verify login was successful by checking for transfer link
      cy.get('a[href="transfer.htm"]')
        .should('be.visible')
        .then(() => {
          cy.log('Login successful - transfer link is visible');
        });
      
      // Navigate to transfer page and initiate transfer
      cy.get('a[href="transfer.htm"]').click();
      cy.get('input[id=amount]').type('100');
      
      // For more transactions, we can use the following code:
      // cy.get('select[id=fromAccountId]').then(($fromSelect) => {
      //   const fromAccount = $fromSelect.find('option').eq(0).val();
        
      //As data is not constant we are selecting the first option
      cy.get('select[id=fromAccountId]').select(0).invoke('val');
      cy.get('select[id=fromAccountId]').select(0).invoke('val');
      cy.get('select[id=toAccountId]').select(0).invoke('val'); // Self transfer
      
      // Submit transfer and verify success
      cy.get('input[type=submit]').click();
      cy.contains('Transfer Complete!').should('be.visible');
      cy.wait(1000)
  
      // Verify transaction in account details
      cy.contains('Accounts Overview').click();
      cy.wait(1000); // Wait for accounts page to load
      
      // Debug log to see what we're clicking
      cy.get('tbody tr:nth-child(1) td:nth-child(1)')
        .then($el => {
          cy.log('Element text:', $el.text());
        });

      // Try clicking the account number link instead
      cy.get('tbody tr:nth-child(1) td:nth-child(1) a')
        .should('be.visible')
        .should('not.be.disabled')
        .click({force: true});
      
      cy.wait(1000);
      
      // Verify the transfer amount
      cy.get('#transactionTable tbody tr')
        .first()
        .within(() => {
          cy.get('td').eq(2)  // Get the third column (Debit)
            .should('be.visible')
            .should('contain', '$100.00');
        });
    });
  
    // Negative test scenarios - testing invalid transfers
    it('should handle invalid fund transfers', function() {
        // Ensure we have credentials from previous test
        expect(testCredentials, 'No test credentials available - registration test must run first').to.exist;
        
        // Get scenarios from fixture and test each one
        this.negativeData.scenarios.forEach((scenario) => {
            // Login for scenario
            cy.login(testCredentials.username, testCredentials.password);
            cy.wait(1000);
            
            // Attempt invalid fund transfer
            cy.get('a[href="transfer.htm"]').click();
            cy.log('Testing invalid amount:', scenario.amount);
            cy.get('input[id=amount]').clear().type(scenario.amount);
            
            // Select accounts for transfer
            cy.get('select[id=fromAccountId]').then(($fromSelect) => {
                const fromAccount = $fromSelect.find('option').eq(0).val();
                cy.get('select[id=fromAccountId]').select(fromAccount);
                cy.get('select[id=toAccountId]').select(fromAccount);
            });
            
            // Submit transfer and verify error
            cy.get('input[type=submit]').click();
            cy.wait(1000); // Wait for error message to appear
            
            // Verify error message - check multiple possible error selectors
            cy.get('body').then($body => {
                // Try different error message selectors
                const errorSelectors = [
                    '.error',
                    '#error',
                    '.errorMessage',
                    '#errorMessage',
                    'div[id=showError]',
                    '.alert-error',
                    '[role="alert"]'
                ];
                
                // Find which error element exists and is visible
                const visibleError = errorSelectors.find(selector => 
                    $body.find(selector).length && $body.find(selector).is(':visible')
                );
                
                if (visibleError) {
                    cy.get(visibleError)
                        .should('be.visible')
                        .then($error => {
                            // Log the actual error message for debugging
                            cy.log('Actual error message:', $error.text());
                            
                            // Verify error message matches expected
                            if (scenario.expectedError) {
                                expect($error.text()).to.include(scenario.expectedError);
                            }
                            
                            // Log if this is a known issue
                            if (scenario.knownIssue) {
                                cy.log('Known Issue:', scenario.knownIssue);
                            }
                        });
                } else {
                    // If no error message is found, this is a potential issue
                    cy.log('Warning: No error message found for invalid transfer');
                    cy.log('This might be a known issue:', scenario.knownIssue);
                }
            });
            
            // Logout after each test
            cy.get('a[href="logout.htm"]').click();
        });
    });
})
