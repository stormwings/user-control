const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
  env: {
    apiUrl: 'http://localhost:8000',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
});
