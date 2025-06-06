/**
 * Utility functions for Parabank tests
 */

/**
 * Generate random string with specified options
 * @param {Object} options - Configuration options
 * @param {number} options.length - Length of random string (default: 8)
 * @param {boolean} options.includeNumbers - Include numbers in generation (default: true)
 * @param {boolean} options.includeSpecial - Include special characters (default: false)
 * @returns {string} Random string
 */
export const generateRandomString = (options = {}) => {
    const {
        length = 8,
        includeNumbers = true,
        includeSpecial = false
    } = options;

    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSpecial) chars += '!@#$%^&*';

    return Array.from(
        { length },
        () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
};

/**
 * Generate random credentials for user registration
 * @param {Object} options - Configuration options
 * @param {string} options.usernamePrefix - Prefix for username (default: 'testuser_')
 * @param {string} options.passwordPrefix - Prefix for password (default: 'Pass_')
 * @returns {Object} Object containing username and password
 */
export const generateCredentials = (options = {}) => {
    const {
        usernamePrefix = 'testuser_',
        passwordPrefix = 'Pass_'
    } = options;

    const randomString = generateRandomString({ length: 8 });
    
    return {
        username: `${usernamePrefix}${randomString}`,
        password: `${passwordPrefix}${randomString}`
    };
};

/**
 * Save user credentials to fixture file
 * @param {Object} credentials - Object containing username and password
 * @returns {Cypress.Chainable} Cypress chain
 */
export const saveCredentials = (credentials) => {
    return cy.writeFile('cypress/fixtures/lastCreatedUser.json', credentials);
}; 