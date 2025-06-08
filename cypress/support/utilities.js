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


/**
 * Extract account ID from XML string
 * @param {String} xmlString - Response from API in XML format
 * @returns {String} - accountId
 */
export const getAccountIdFromXml = (xmlString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  
      // Check for parsing errors
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        console.error("Error parsing XML:", errorNode.textContent);
        return null;
      }
  
      // Select the 'id' element which is a direct child of 'account'
      const accountIdElement = xmlDoc.querySelector("account > id");
  
      if (accountIdElement) {
        return accountIdElement.textContent;
      } else {
        console.warn("Account ID element not found in the XML.");
        return null;
      }
    } catch (e) {
      console.error("An unexpected error occurred while processing XML:", e);
      return null;
    }
  }

/**
 * Reads the 'amount' of the first 'Debit' transaction from an XML string.
 *
 * @param {string} xmlString The XML string containing transaction data.
 * @returns {string | null} The amount of the first debit transaction if found, otherwise null.
 */
export const getFirstDebitAmountFromXml = (xmlString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  
      // Check for parsing errors
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        console.error("Error parsing XML:", errorNode.textContent);
        return null;
      }
  
      // Select the first 'transaction' element where its 'type' child has text content 'Debit'
      const firstDebitTransactionElement = xmlDoc.evaluate(
        "//transaction[type='Debit']", // XPath to find any transaction whose 'type' child is 'Debit'
        xmlDoc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE, // We only want the first one found
        null
      ).singleNodeValue;
  
      if (firstDebitTransactionElement) {
        const amountElement = firstDebitTransactionElement.querySelector("amount");
        if (amountElement) {
          return amountElement.textContent;
        } else {
          console.warn("No 'amount' element found for the first debit transaction.");
          return null;
        }
      } else {
        console.warn("No 'Debit' transaction found in the XML.");
        return null;
      }
    } catch (e) {
      console.error("An unexpected error occurred while processing XML:", e);
      return null;
    }
  }

  /**
 * Reads the 'balance' from an XML string representing an account.
 *
 * @param {string} xmlString The XML string containing account data.
 * @returns {string | null} The account balance as a string if found, otherwise null.
 */
export const getBalanceFromAccountXml = (xmlString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  
      // Check for parsing errors
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        console.error("Error parsing XML:", errorNode.textContent);
        return null;
      }
  
      // Select the 'balance' element which is a direct child of 'account'
      const balanceElement = xmlDoc.querySelector("account > balance");
  
      if (balanceElement) {
        return balanceElement.textContent;
      } else {
        console.warn("Balance element not found in the XML.");
        return null;
      }
    } catch (e) {
      console.error("An unexpected error occurred while processing XML:", e);
      return null;
    }
  }