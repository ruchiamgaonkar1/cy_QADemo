/// <reference types="cypress" />

import {
    getCustomerAccounts,
    performTransfer,
    verifyTransaction,
    verifyAccountBalance
} from '../../support/api-utils';
import { getAccountIdFromXml, getBalanceFromAccountXml } from '../../support/utilities';

describe('Transfer Validation via API', () => {
    beforeEach(() => {
        // Load test data and configuration
        cy.fixture('lastCreatedUser').as('lastUser');
        cy.fixture('config').as('config');
        cy.fixture('negativeFundTransferData').as('negativeData');
         // Load saved state if it exists
         cy.fixture('testState').then((state) => {
            if (state.customerId) {
                Cypress.env('customerId', state.customerId);
            }
        });
    });

    it('should perform valid fund transfer via API', function() {
        // First login via API to get session and customer ID
        cy.login(this.lastUser.username, this.lastUser.password, true)
            .then(() => {
                expect(Cypress.env('customerId')).to.not.be.null;
                cy.log('Using customer ID:', Cypress.env('customerId'));

                // Get accounts and perform transfer
                getCustomerAccounts(Cypress.env('customerId')).then((accountsResponse) => {
                    expect(accountsResponse.status).to.eq(200);
                    const accountId = getAccountIdFromXml(accountsResponse.body);
                    const initialBalance = getBalanceFromAccountXml(accountsResponse.body);
                    const fromAccount = accountId;
                    const toAccount = accountId; // Self transfer for testing
                    const amount = 100;

                    // Perform transfer
                    performTransfer({ fromAccountId: fromAccount, toAccountId: toAccount, amount:amount })
                        .then((transferResponse) => {
                            expect(transferResponse.status).to.eq(200);
                            
                            // Verify transaction was recorded
                            verifyTransaction({ 
                                accountId: fromAccount, 
                                amount,
                            });

                            // Verify account balance
                            verifyAccountBalance({
                                accountId: fromAccount,
                                expectedBalance: Number(initialBalance + amount).toFixed(1) // Balance should remain same for self-transfer
                            });
                        });
                });
            });
    });
});