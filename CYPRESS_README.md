Cypress E2E tests

Quick start (Windows PowerShell):

1. Install dependencies:

```powershell
cd 'c:\Users\nblai\OneDrive\Github\frontend\bookkeeper-frontend-1'
npm install
```

2. Start the frontend app (and backend API if you want real integration):

```powershell
npm start
# in another shell, start backend or run it in Docker
```

3. Open Cypress interactive runner:

```powershell
npm run cypress:open
```

Or run headless in CI:

```powershell
npm run cypress:run
```

Notes:
- The tests stub backend API calls using `cy.intercept` so you can run them against only the frontend app.
- Update `cypress.config.js` baseUrl if your frontend runs on a different port.

New tests added:
- Loan comparison
- Mortgage affordability
These are covered in `cypress/e2e/calculators.cy.js` along with the existing calculator flows.
