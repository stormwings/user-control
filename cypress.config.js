const { defineConfig } = require("cypress");

let webpackConfig;
try {
  // Reuse CRA's webpack config for Component Testing
  webpackConfig = require("react-scripts/config/webpack.config")("development");
} catch {
  webpackConfig = undefined; // CT will error if this fails; keep CRA in deps
}

module.exports = defineConfig({
  video: true,
  chromeWebSecurity: false,
  retries: { runMode: 2, openMode: 0 },
  env: {
    // adapt to your API if needed
    API_URL: "http://localhost:3001/api"
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig, // uses CRA's webpack (no eject)
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.js",
  },
});
