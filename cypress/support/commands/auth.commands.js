/**
 * Authentication related Cypress commands
 */

/**
 * Login with provided credentials
 * Can be used for both UI and API login
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @param {boolean} useApi - Whether to use API for login (default: false)
 * @example
 * cy.login('testuser', 'testpass') // UI login
 * cy.login('testuser', 'testpass', true) // API login
 */
Cypress.Commands.add('login', (username, password, useApi = false) => {
    // Store credentials for later use
    Cypress.env('username', username);
    Cypress.env('password', password);
    cy.log('Attempting login for user:', username);

    if (useApi) {
        // API Login
        return cy.fixture('config').then((config) => {
            cy.request({
                method: 'POST',
                url: `${config.baseUrl}/login.htm`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: {
                    username: username,
                    password: password
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log('API Login Response:', response.status);
                expect(response.status).to.eq(200);
                return cy.wrap(response);
            });
        });
    } else {
        // UI Login
        cy.navigateToLogin();
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);
        cy.get('input[value="Log In"]').click();
        cy.wait(1000); // Wait for login process
    }
});

/**
 * Logout from the application
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
    cy.get('a[href="logout.htm"]').click();
    cy.wait(500);
});

export {}; 