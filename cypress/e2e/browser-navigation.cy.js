describe('Browser Navigation Tests', () => {
    beforeEach(() => {
        // Navigate to login page before each test
        cy.navigateToLogin();
        cy.fixture('config').as('config');
        cy.fixture('lastCreatedUser').as('lastUser');
        cy.fixture('newUserData').as('userData');
    });

    it('should handle browser back and forward navigation correctly', function() {
        // Store the login page URL
        cy.visit(this.config.baseUrl + '/index.htm');

        // Click on Register link and verify navigation
        cy.contains('Register').click();
        cy.url().should('include', '/register.htm');
        cy.get('#rightPanel h1').should('contain', 'Signing up is easy!');

        // Go back to login page using browser back button
        cy.go('back');
        cy.url().should('eq', this.config.baseUrl + '/index.htm');
        cy.get('input[name="username"]').should('be.visible');

        // Go forward to register page using browser forward button
        cy.go('forward');
        cy.url().should('include', '/register.htm');
        cy.get('#rightPanel h1').should('contain', 'Signing up is easy!');

        // Navigate to About Us page
        cy.contains('About Us').click();
        cy.url().should('include', '/about.htm');
        cy.get('#rightPanel h1').should('contain', 'ParaSoft Demo Website');

        // Test multiple back navigation
        cy.go('back'); // Back to register page
        cy.url().should('include', '/register.htm');
        
        cy.go('back'); // Back to login page
        cy.url().should('eq', this.config.baseUrl + '/index.htm');

        // Test multiple forward navigation
        cy.go('forward'); // Forward to register page
        cy.url().should('include', '/register.htm');
        
        cy.go('forward'); // Forward to about page
        cy.url().should('include', '/about.htm');
    });

    it('should handle navigation after login', function() {
        cy.registerUser(this.userData, {
            usernamePrefix: this.userData.usernamePrefix,
            passwordPrefix: this.userData.password
        }).then(credentials => {
            cy.logout();
            cy.login(credentials.username, credentials.password);
        });

        // Verify successful login
        cy.get('#leftPanel').should('contain', 'Account Services');

        // Navigate to Transfer Funds
        cy.contains('Transfer Funds').click();
        cy.url().should('include', '/transfer.htm');
        cy.get('#rightPanel h1').should('contain', 'Transfer Funds');
        cy.wait(1000);

        // Go back to accounts overview
        cy.go('back');
        cy.get('#rightPanel h1').should('contain', 'Accounts Overview');

        // Go forward to transfer funds
        cy.go('forward');
        cy.get('#rightPanel h1').should('contain', 'Transfer Funds');

        // Test browser refresh
        cy.reload();
        cy.get('#rightPanel h1').should('contain', 'Transfer Funds');
    });
}); 