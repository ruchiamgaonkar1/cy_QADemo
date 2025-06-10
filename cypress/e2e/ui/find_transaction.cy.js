/// <reference types="cypress" />
import dayjs from 'dayjs';

describe('Find Transaction Tests', () => {
  beforeEach(() => {
    cy.fixture('config').as('config');
    cy.fixture('lastCreatedUser').as('lastUser');
  });

  describe('Setup: Create Test Transaction', () => {
    it('should make a fund transfer for testing', function() {
      cy.login(this.lastUser.username, this.lastUser.password);
      cy.makeFundTransfer({
        amount: '100',
        fromAccountIndex: 0,
        toAccountIndex: 0
      });
      cy.verifyTransferSuccess();
    });
  });

  describe('Find Transactions Functionality', () => {
    beforeEach(function() {
      cy.login(this.lastUser.username, this.lastUser.password);
      cy.navigateToFindTransactions();
      cy.selectAccountForSearch(0);
    });

    describe('Search by Transaction ID', () => {
      // TODO: Need to store the transaction ID in the fixture
      // it('should find transaction by valid ID', () => {
      //   cy.findTransactionById('25576');
      //   cy.verifyTransactionResults();
      // });

      it('should handle invalid transaction ID', () => {
        cy.findTransactionById('invalid123');
        cy.get('#transactionIdError').first().should('not.be.empty');
      });
    });

    describe('Search by Date', () => {
      it('should find transactions for today', () => {
        const today = dayjs().format('MM-DD-YYYY');
        cy.findTransactionByDate(today);
        cy.verifyTransactionResults();
      });

      it('should handle invalid date format', () => {
        cy.findTransactionByDate('2024/03/15');
        cy.get('#transactionDateError').should('not.be.empty');
      });

      it('should handle future date', () => {
        const futureDate = dayjs().add(1, 'year').format('MM-DD-YYYY');
        cy.findTransactionByDate(futureDate);
        cy.verifyEmptyTransactionResults();
      });
    });

    describe('Search by Date Range', () => {
      it('should find transactions within date range', () => {
        const fromDate = dayjs().subtract(7, 'day').format('MM-DD-YYYY');
        const toDate = dayjs().format('MM-DD-YYYY');
        cy.findTransactionByDateRange(fromDate, toDate);
        cy.verifyTransactionResults();
      });

      it('should handle invalid date range (future to past)', () => {
        const futureDate = dayjs().add(1, 'year').format('MM-DD-YYYY');
        const pastDate = dayjs().subtract(1, 'year').format('MM-DD-YYYY');
        cy.findTransactionByDateRange(futureDate, pastDate);
        cy.verifyEmptyTransactionResults();
      });
    });

    describe('Search by Amount', () => {
      it('should find transactions by exact amount', () => {
        cy.findTransactionByAmount('100.00');
        cy.verifyTransactionResults();
      });

      it('should handle invalid amount format', () => {
        cy.findTransactionByAmount('abc');
        cy.get('#amountError').should('not.be.empty');
      });

      it('should handle non-existent amount', () => {
        cy.findTransactionByAmount('999999.99');
        cy.verifyEmptyTransactionResults();
      });
    });

    describe('Transaction Details', () => {
      it('should display correct transaction details in results', () => {
        const today = dayjs().format('MM-DD-YYYY');
        cy.findTransactionByDate(today);
        cy.verifyTransactionDetails();
      });

      it('should navigate to transaction details page', () => {
        const today = dayjs().format('MM-DD-YYYY');
        cy.findTransactionByDate(today);
        cy.openFirstTransactionDetails();
      });
    });
  });
});