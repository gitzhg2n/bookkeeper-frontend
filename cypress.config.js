const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here if necessary
    },
  },
});
