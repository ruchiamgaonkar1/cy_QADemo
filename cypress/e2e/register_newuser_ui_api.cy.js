/// <reference types="cypress" />
describe('Parabank - Register New User', () => {
    beforeEach(() => {
      cy.fixture('newUserData').as('userData');
      cy.fixture('config').as('config');
    });
  
    it('should register a new user successfully', function () {
        const randomString = Math.random().toString(36).substring(2, 10);
        // const username = `${this.userData.usernamePrefix}12321`;
        // const password = `Pass_${randomString}`;
        
        const username = `${this.userData.usernamePrefix}${randomString}`;
        const password = `Pass_${randomString}`;

        // Save to fixture
        cy.writeFile('cypress/fixtures/lastCreatedUser.json', { username, password });

        cy.visit(`${this.config.baseUrl}/register.htm`);
    
        cy.get('input[name="customer\.firstName"]').type(this.userData.firstName);
        cy.get('input[name="customer\.lastName"]').type(this.userData.lastName);
        cy.get('input[name="customer\.address\.street"]').type(this.userData.address);
        cy.get('input[name="customer\.address\.city"]').type(this.userData.city);
        cy.get('input[name="customer\.address\.state"]').type(this.userData.state);
        cy.get('input[name="customer\.address\.zipCode"]').type(this.userData.zipCode);
        cy.get('input[name="customer\.phoneNumber"]').type(this.userData.phone);
        cy.get('input[name="customer\.ssn"]').type(this.userData.ssn);
        cy.get('input[name="customer\.username"]').type(username);
        cy.get('input[name="customer\.password"]').type(password);
        cy.get('input[name="repeatedPassword"]').type(password);
    
        cy.get('input[value=Register]').click();
        cy.contains('Welcome ' + `${username}`).should('be.visible');
        cy.contains('Your account was created successfully. You are now logged in.').should('be.visible');
        cy.get('a[href="logout.htm"]').click();
        cy.wait(10000)
        
        
        //API validation of user login
        cy.log(`${this.config.baseUrl}/index.htm`)
        cy.request({
            method: 'GET',
            url: `${this.config.baseUrl}/index.htm`,
            form: true,
            body: {
            username: `${username}`,
            password: `${password}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            
        });
    });
    
  });