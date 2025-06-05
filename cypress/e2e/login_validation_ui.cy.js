/// <reference types="cypress" />
describe('Login Validation', () => {
    beforeEach(() => {
        cy.fixture('config').as('config');
        cy.fixture('lastCreatedUser').as('lastUser');
        
    });
    it('should login with valid credentials', function(){
        cy.visit(`${this.config.baseUrl}/index.htm`);
        cy.log('lastCreatedUser', this.lastUser.username);
        cy.get('input[name="username"]').type(this.lastUser.username);
        cy.get('input[name="password"]').type(this.lastUser.password);
        cy.get('input[value="Log In"]').click();
        cy.wait(500)
        cy.get('a[href="logout.htm"]').click();
    });
    it('should login with invalid credentials', function(){
        cy.visit(`${this.config.baseUrl}/index.htm`);
        cy.get('input[name="username"]').type('invalid');
        cy.get('input[name="password"]').type('invalid');
        cy.get('input[value="Log In"]').click();
        cy.wait(500)
        cy.contains('The username and password could not be verified.').should('be.visible');
    });
    it('should login with valid username and invalid password credentials', function(){
        cy.visit(`${this.config.baseUrl}/index.htm`);
        cy.get('input[name="username"]').type(this.lastUser.username);
        cy.get('input[name="password"]').type('invalid');
        cy.get('input[value="Log In"]').click();
        cy.wait(500)
        cy.contains('The username and password could not be verified.').should('be.visible');
    });
    it('should login with invalid username and valid password credentials', function(){
        cy.visit(`${this.config.baseUrl}/index.htm`);
        cy.get('input[name="username"]').type('invalid');
        cy.get('input[name="password"]').type(this.lastUser.password);
        cy.get('input[value="Log In"]').click();
        cy.wait(500)
        cy.contains('The username and password could not be verified.').should('be.visible');
    });
    
});