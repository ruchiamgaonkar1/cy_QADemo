const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // require('cypress-mochawesome-reporter/plugin')(on);
    },
  
  reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: false,
      reportPageTitle: 'custom-title',
      embeddedScreenshots: false,
    },
  },
});
