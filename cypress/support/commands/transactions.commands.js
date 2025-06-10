/**
 * Custom Commands for Find Transaction Tests
 */

Cypress.Commands.add('navigateToFindTransactions', () => {
    cy.get('a[href="findtrans.htm"]').click();
    // Wait for form container to be present
    cy.get('#formContainer').should('exist');
    // Verify title
    cy.get('#formContainer h1.title').should('contain', 'Find Transactions');
  });
  
  Cypress.Commands.add('selectAccountForSearch', (accountIndex = 0) => {
    // Ensure form is visible
    cy.get('#formContainer').should('not.have.css', 'display', 'none');
    cy.get('#accountId').select(accountIndex);
    // Verify no account selection error
    cy.get('#accountIdError').should('be.empty');
  });
  
  Cypress.Commands.add('findTransactionById', (transactionId) => {
    cy.get('#formContainer').should('not.have.css', 'display', 'none');
    cy.get('#transactionId')
      .clear()
      .type(transactionId);
    cy.get('#findById').click();
    // Handle potential errors
    cy.get('#errorContainer').then($error => {
      if ($error.is(':visible')) {
        throw new Error(`Transaction search failed: ${$error.find('p.error').text()}`);
      }
    });
  });
  
  Cypress.Commands.add('verifyLoggedError', () => {
      cy.get('#errorContainer')
          .should('be.visible')
          .find('p.error')
          .should('not.be.empty');
  });
  
  Cypress.Commands.add('findTransactionByDate', (date) => {
    cy.get('#formContainer').should('not.have.css', 'display', 'none');
    cy.get('#transactionDate')
      .clear()
      .type(date);
    cy.get('#findByDate').click();
    // Handle potential errors
    cy.get('#errorContainer').then($error => {
      if ($error.is(':visible')) {
        throw new Error(`Transaction search failed: ${$error.find('p.error').text()}`);
      }
    });
  });
  
  Cypress.Commands.add('findTransactionByDateRange', (fromDate, toDate) => {
    cy.get('#formContainer').should('not.have.css', 'display', 'none');
    cy.get('#fromDate')
      .clear()
      .type(fromDate);
    cy.get('#toDate')
      .clear()
      .type(toDate);
    cy.get('#findByDateRange').click();
    // Handle potential errors
    cy.get('#errorContainer').then($error => {
      if ($error.is(':visible')) {
        throw new Error(`Transaction search failed: ${$error.find('p.error').text()}`);
      }
    });
  });
  
  Cypress.Commands.add('findTransactionByAmount', (amount) => {
    cy.get('#formContainer').should('not.have.css', 'display', 'none');
    cy.get('#amount')
      .clear()
      .type(amount);
    cy.get('#findByAmount').click();
    // Handle potential errors
    cy.get('#errorContainer').then($error => {
      if ($error.is(':visible')) {
        throw new Error(`Transaction search failed: ${$error.find('p.error').text()}`);
      }
    });
  });
  
  Cypress.Commands.add('verifyTransactionResults', () => {
    // Verify results container is visible
    cy.get('#resultContainer')
      .should('be.visible')
      .and('not.have.css', 'display', 'none');
    
    // Verify table exists and has content
    cy.get('#transactionTable')
      .should('be.visible')
      .find('#transactionBody tr')
      .should('have.length.at.least', 1);
  
    // Verify table headers
    cy.get('#transactionTable thead th').should($headers => {
      expect($headers).to.have.length(4);
      expect($headers.eq(0)).to.contain('Date');
      expect($headers.eq(1)).to.contain('Transaction');
      expect($headers.eq(2)).to.contain('Debit');
      expect($headers.eq(3)).to.contain('Credit');
    });
  });

  Cypress.Commands.add('verifyEmptyTransactionResults', () => {
    // Verify results container is visible
    cy.get('#resultContainer')
      .should('be.visible')
      .and('not.have.css', 'display', 'none');
    
    // Verify table exists and has content
    cy.get('#transactionTable')
      .should('be.visible')
      .find('#transactionBody tr')
      .should('have.length.at.least', 0);
  });
  
  Cypress.Commands.add('verifyTransactionDetails', () => {
    cy.get('#transactionTable tbody tr').first().within(() => {
      // Verify all columns exist
      cy.get('td').should('have.length', 4);
      
      // Verify date format
      cy.get('td').eq(0)
        .invoke('text')
        .should('match', /^\d{2}-\d{2}-\d{4}$/);
      
      // Verify transaction link
      cy.get('td').eq(1).find('a')
        .should('have.attr', 'href')
        .and('include', '/parabank/transaction.htm?id=');
      
      // Verify amount format in either debit or credit column
      cy.get('td').eq(2).then($debit => {
        cy.get('td').eq(3).then($credit => {
          const hasValidAmount = 
            /^\$\d+\.\d{2}$/.test($debit.text()) || 
            /^\$\d+\.\d{2}$/.test($credit.text());
          expect(hasValidAmount).to.be.true;
        });
      });
    });
  });
  
  Cypress.Commands.add('openFirstTransactionDetails', () => {
    cy.get('#transactionTable tbody tr')
      .first()
      .find('td a')
      .click();
    
    // Verify transaction details page
    cy.url().should('include', '/parabank/transaction.htm?id=');
  });
  
  // Helper command to get account numbers
  Cypress.Commands.add('getAccountNumbers', () => {
    return cy.get('select[id=fromAccountId] option').then($options => {
      return [...$options].map(option => option.value);
    });
  });

  Cypress.Commands.add('verifyTransferSuccess', () => {
    cy.contains('Transfer Complete!')
      .should('be.visible');
  });

  Cypress.Commands.add('makeFundTransfer', ({ amount, fromAccountIndex, toAccountIndex }) => {
    // Navigate to transfer page
    cy.get('a[href="transfer.htm"]').click();
    
    // Enter amount
    cy.get('input[id=amount]').clear().type(amount);
    
    // Select accounts
    cy.get('select[id=fromAccountId]').select(fromAccountIndex);
    cy.get('select[id=toAccountId]').select(toAccountIndex);
    
    // Submit transfer
    cy.get('input[type="submit"]').click();
  });

// Export an empty object to satisfy module requirements
export {};