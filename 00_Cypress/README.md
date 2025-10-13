# Cypress E2E Tests for Fake Info Application

## Overview
This directory contains end-to-end tests for the Fake Info application using Cypress.

## Test Files
- `fake-info-test.cy.js` - Comprehensive test suite covering all functionality
- `basic-test.cy.js` - Simple starter tests for basic functionality

## Prerequisites
1. **Frontend Server**: Your HTML page should be running on `http://127.0.0.1:5500/index.html`
2. **Backend API**: The Node.js API should be running on `http://localhost:3000`

## Running Tests

### Install Cypress (if not already installed)
```bash
npm install cypress --save-dev
```

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cypress:open
```

### Run Tests Headlessly (CI Mode)
```bash
npm run cypress:run
```

### Run Only E2E Tests
```bash
npm run test:e2e
```

## Test Setup

### Start Your Services
1. **Start your frontend**: Make sure your HTML page is served on `http://127.0.0.1:5500/index.html`
2. **Start the API**: Run `npm start` or `npm run dev` to start the Node.js server on port 3000

### Configuration
The tests are configured in `cypress.config.js` with:
- Base URL: `http://127.0.0.1:5500`
- Spec pattern: `00_Cypress/**/*.cy.js`
- Default viewport: 1280x720

## Test Categories

### Basic Tests (`basic-test.cy.js`)
- Page loading
- Element visibility
- Basic API connectivity
- Simple interaction testing

### Comprehensive Tests (`fake-info-test.cy.js`)
- **Page Load**: Verify page loads correctly
- **API Integration**: Test all API endpoints
- **Multiple Persons**: Test bulk data generation
- **Error Handling**: Test error scenarios
- **UI Responsiveness**: Test on different screen sizes
- **Data Validation**: Verify data format and consistency
- **Performance**: Check load times and response times
- **Accessibility**: Basic accessibility checks

## Expected Frontend Elements
The tests assume your HTML page has:
- Buttons or links to trigger API calls
- Input fields for specifying number of persons
- Display areas for showing generated data
- Proper form labels and accessibility features

## Customizing Tests
To adapt these tests to your specific frontend:

1. **Update selectors**: Modify the CSS selectors to match your HTML structure
2. **Adjust expectations**: Update the assertions based on your UI behavior
3. **Add custom tests**: Create additional test files for specific features

## Common Issues and Solutions

### API Server Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Solution**: Start your Node.js API server with `npm start`

### Frontend Server Not Running
```
Error: Visit to http://127.0.0.1:5500/index.html was not successful
```
**Solution**: Start your frontend server (Live Server, http-server, etc.)

### Tests Failing Due to Different HTML Structure
**Solution**: Update the CSS selectors in the test files to match your HTML elements

## Best Practices
1. **Keep tests independent**: Each test should work standalone
2. **Use data-testid attributes**: Add `data-testid` to your HTML elements for reliable selection
3. **Mock external dependencies**: Use `cy.intercept()` to mock API calls when needed
4. **Clean up after tests**: Reset state between tests if necessary

## Example HTML Structure
For best test compatibility, consider using:
```html
<button data-testid="generate-cpr">Generate CPR</button>
<button data-testid="generate-person">Generate Person</button>
<input data-testid="person-count" type="number" placeholder="Number of persons">
<div data-testid="results"></div>
```

Then update test selectors to:
```javascript
cy.get('[data-testid="generate-cpr"]').click()
cy.get('[data-testid="results"]').should('contain.text', /\d{10}/)
```