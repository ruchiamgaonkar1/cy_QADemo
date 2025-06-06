//cypress/e2e/register_newuser_ui_api.cy.js

/// <reference types="cypress" />

/**
 * End-to-End Test Suite for Parabank Fund Transfer Functionality
 * Tests both positive and negative scenarios for fund transfers
 */
describe('Parabank - End-to-End UI Workflow (Login via UI + Fund Transfer)', () => {
    beforeEach(() => {
      // Load test data from fixtures
      cy.fixture('lastCreatedUser').as('lastUser');
      cy.fixture('config').as('config');
    });
  
    // Positive test scenario - successful fund transfer
    it('should login via UI, perform fund transfer, and verify transaction', function () {
      // Step 1: Login via UI
      cy.visit(`${this.config.baseUrl}/index.htm`);
      cy.log('lastCreatedUser', this.lastUser.username);
      cy.get('input[name="username"]').type(this.lastUser.username);
      cy.get('input[name="password"]').type(this.lastUser.password);
      cy.get('input[value="Log In"]').click();
      cy.wait(500)
      
      // Step 2: Navigate to transfer page and initiate transfer
      cy.get('a[href="transfer.htm"]').click();
      cy.get('input[id=amount]').type('100');
      
      // Select accounts for transfer (using first account for both from/to)
      cy.get('select[id=fromAccountId]').select(0).invoke('val');
      cy.get('select[id=fromAccountId]').select(0).invoke('val');
      cy.get('select[id=toAccountId]').select(0).invoke('val'); // Self transfer
      
      // Submit transfer and verify success
      cy.get('input[type=submit]').click();
      cy.contains('Transfer Complete!').should('be.visible');
      cy.wait(1000)
  
      // Step 3: Verify transaction in account details
      cy.contains('Accounts Overview').click();
      cy.wait(1000); // Wait for accounts page to load
      
      // Debug log to see what we're clicking
      cy.get('tbody tr:nth-child(1) td:nth-child(1)')
        .then($el => {
          cy.log('Element text:', $el.text());
        });
 
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
  
    // Array of negative test scenarios
    const negativeFundTransferScenarios = [
      { amount: ' ', description: 'missing amount' },
      { amount: '-50', description: 'negative amount' },   //ideally it should fail : currently it is passing
      { amount: 'abc', description: 'non-numeric amount' },
      { amount: '1000000', description: 'excessively large amount' }, //ideally it should fail : currently it is passing
      { amount: '999999999999', description: 'transfer amount exceeds available balance' }//ideally it should fail : currently it is passing
    ];
  
    // Negative test scenarios - testing invalid transfers
    negativeFundTransferScenarios.forEach(({ amount, description }) => {
      it(`should show error on fund transfer with ${description}`, function () {
        // Step 1: Login for each negative scenario
        cy.visit(`${this.config.baseUrl}/index.htm`);
        cy.log('lastCreatedUser', this.lastUser.username);
        cy.get('input[name="username"]').type(this.lastUser.username);
        cy.get('input[name="password"]').type(this.lastUser.password);
        cy.get('input[value="Log In"]').click();
        cy.wait(500)
         
        // Step 2: Attempt invalid fund transfer
        cy.get('a[href="transfer.htm"]').click();
        cy.log('Testing invalid amount:', amount);
        cy.get('input[id=amount]').clear().type(amount);
        
        // Select accounts for transfer
        cy.get('select[id=fromAccountId]').then(($fromSelect) => {
          const fromAccount = $fromSelect.find('option').eq(0).val();
          cy.get('select[id=fromAccountId]').select(fromAccount);
          cy.get('select[id=toAccountId]').select(fromAccount);
        });
        
        // Submit transfer and verify error message appears
        cy.get('input[type=submit]').click();
        cy.get('div[id=showError]').should('be.visible') // Check for error message element
        
        // Logout after each negative test
        cy.get('a[href="logout.htm"]').click();
      });
    });
  });
  