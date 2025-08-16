// Cypress support file: global hooks and custom commands

// Optionally import commands from cypress/support/commands.js
// import './commands'

Cypress.Commands.add('login', (token) => {
  // Set localStorage auth token if your app reads it
  if (token) {
    window.localStorage.setItem('auth_token', token)
  }
});

beforeEach(() => {
  // clear local storage between tests to avoid cross-test contamination
  cy.clearLocalStorage();
});

// Helper to fill and submit forms by label
Cypress.Commands.add('typeByLabel', (label, value) => {
  cy.get(`input[aria-label="${label}"]`).clear().type(value);
});
