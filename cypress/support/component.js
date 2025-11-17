import "./commands";
import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";
import "@cypress/code-coverage/support";

// Pull in your app styles (Tailwind)
import "../../src/index.css";

// Provide a default mount that wraps BrowserRouter (add providers if needed)
// eslint-disable-next-line no-unused-vars
import React from "react";
import { mount } from "cypress/react18";
import { BrowserRouter } from "react-router-dom";

// eslint-disable-next-line no-undef
Cypress.Commands.add("mount", (component, options = {}) => {
  return mount(<BrowserRouter>{component}</BrowserRouter>, options);
});

// Now you can: cy.mount(<MyComponent/>)
