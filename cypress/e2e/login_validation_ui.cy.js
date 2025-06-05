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
    //negative test cases
    const negativeLoginScenarios = [
        { username: 'wrongUser', password: 'wrongPass', description: 'invalid username and password' },
        { username: ' ', password: ' ', description: 'empty credentials' },
        { username: 'admin', password: ' ', description: 'missing password' },
      ];
    
    negativeLoginScenarios.forEach(({ username, password, description }) => {
        it(`should not login with ${description}`, function () {
            cy.log('username', `${username}`);
            cy.visit(`${this.config.baseUrl}/index.htm`);
            cy.get('input[name="username"]').type(username);
            cy.get('input[name="password"]').type(password);
            cy.get('input[value="Log In"]').click();
            cy.wait(500)
            
        });
      });
    
});