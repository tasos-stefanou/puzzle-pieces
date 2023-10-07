# User Registration Tests

This repository contains Cypress tests to verify user registration functionality using API and UI. The tests cover the registration process, activation of the registered user, and login via the UI.

## Getting Started

To get started with running the User Registration tests, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run both client and backend servers:

   ```bash
   cd client
   npm start
   ```

   ```bash
   cd server
   npm start
   ```

3. Run tests on browser:

   ```bash
   cd root directory
   npx cypress open
   ```

   Or run test on command line:

   ```bash
   npx cypress run cypress/e2e/auth-tests/registrationTests.spec.cy.js
   ```
