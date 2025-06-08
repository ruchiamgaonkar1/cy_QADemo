/**
 * API Utility functions for Parabank tests
 */

import { getFirstDebitAmountFromXml, getBalanceFromAccountXml } from '../support/utilities';

/**
 * Get customer accounts via API
 * @param {string} customerId - Optional customer ID (defaults to env variable)
 * @returns {Cypress.Chainable} Promise resolving to accounts response
 */
export const getCustomerAccounts = (customerId = Cypress.env('customerId')) => {
    return cy.fixture('config').then((config) => {
        const accountsUrl = config.apiEndpoints.accounts.replace('{customerId}', customerId);
        return cy.request({
            method: 'GET',
            url: `${config.apiUrl}${accountsUrl}`,
            failOnStatusCode: false
        });
    });
};

/**
 * Perform fund transfer via API
 * @param {Object} transferData - Transfer details
 * @param {string|number} transferData.fromAccountId - Source account ID
 * @param {string|number} transferData.toAccountId - Destination account ID
 * @param {string|number} transferData.amount - Transfer amount
 * @returns {Cypress.Chainable} Promise resolving to transfer response
 */
export const performTransfer = ({ fromAccountId, toAccountId, amount }) => {
    return cy.fixture('config').then((config) => {
        const transferUrl = config.apiEndpoints.transfer
            .replace('{fromAccountId}', fromAccountId)
            .replace('{toAccountId}', toAccountId)
            .replace('{amount}', amount);
        return cy.request({
            method: 'POST',
            url: `${config.apiUrl}${transferUrl}`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {},
            failOnStatusCode: false
        });
    });
};

/**
 * Get account transactions via API
 * @param {string|number} accountId - Account ID to get transactions for
 * @returns {Cypress.Chainable} Promise resolving to transactions response
 */
export const getAccountTransactions = (accountId) => {
    return cy.fixture('config').then((config) => {
        const transactionsUrl = config.apiEndpoints.transactions.replace('{accountId}', accountId);
        return cy.request({
            method: 'GET',
            url: `${config.apiUrl}${transactionsUrl}`,
            failOnStatusCode: false
        });
    });
};

/**
 * Verify a specific transaction
 * @param {Object} params - Verification parameters
 * @param {string|number} params.accountId - Account ID to verify transaction for
 * @param {number} params.amount - Expected transaction amount
 * @param {Object} params.options - Additional options
 * @param {number} params.options.index - Transaction index to check (default: 0 for latest)
 * @param {string} params.options.type - Expected transaction type (e.g., 'DEBIT', 'CREDIT')
 * @returns {Cypress.Chainable} Promise resolving to verification result
 */
export const verifyTransaction = ({ accountId, amount, options = {} }) => {
    const { index = 0, type } = options;

    return getAccountTransactions(accountId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.at.least(index + 1);

        const firstDebitAmount = getFirstDebitAmountFromXml(response.body);
        expect(Number(firstDebitAmount)).to.equal(amount);
        
        return firstDebitAmount;
    });
};

/**
 * Get account balance via API
 * @param {string|number} accountId - Account ID to get balance for
 * @returns {Cypress.Chainable} Promise resolving to balance response
 */
export const getAccountBalance = (accountId) => {
    return cy.fixture('config').then((config) => {
        const balanceUrl = config.apiEndpoints.balance.replace('{accountId}', accountId);
        return cy.request({
            method: 'GET',
            url: `${config.apiUrl}${balanceUrl}`,
            failOnStatusCode: false
        });
    });
};

/**
 * Verify account balance matches expected amount
 * @param {Object} params - Verification parameters
 * @param {string|number} params.accountId - Account ID to verify balance for
 * @param {number} params.expectedBalance - Expected balance amount
 * @returns {Cypress.Chainable} Promise resolving to verification result
 */
export const verifyAccountBalance = ({ accountId, expectedBalance }) => {
    return getAccountBalance(accountId).then((response) => {
        expect(response.status).to.eq(200);
        const actualBalance = Number(getBalanceFromAccountXml(response.body));
        expect(actualBalance).to.equal(Number(expectedBalance));
        return cy.wrap(actualBalance);
    });
}; 