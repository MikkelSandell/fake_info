# 🇩🇰 Danish Fake Personal Data Generator

## 📖 Purpose
A complete Node.js REST API that generates realistic fake data for nonexistent Danish persons. Originally converted from PHP to JavaScript with comprehensive E2E testing using Cypress.

## ✨ Features
- **Complete Person Generation**: CPR numbers, names, addresses, phone numbers
- **Partial Data Generation**: Generate only specific fields (CPR only, name+gender, etc.)
- **Danish Localization**: Authentic Danish names, addresses, and phone number formats  
- **Database Integration**: MySQL/MariaDB with fallback to mock data
- **Web Interface**: Interactive HTML form for easy data generation
- **Comprehensive Testing**: Full Cypress E2E test suite with complete functionality coverage

## 🛠️ Dependencies

### Runtime Dependencies
- **Node.js** 16.0.0 or higher
- **Express.js** 4.18.2 - Web framework
- **MySQL2** 3.6.0 - Database connector
- **CORS** 2.8.5 - Cross-origin resource sharing

### Development Dependencies  
- **Cypress** 15.4.0 - E2E testing framework
- **Nodemon** 3.0.1 - Development auto-restart

### Data Sources
- **Names & Gender**: `data/person-names.json` (Danish first/last names)
- **Addresses**: MySQL/MariaDB database `addresses` (postal codes & towns)
- **Fallback**: Mock data when database unavailable

## 🚀 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup (Optional)
- **SQL Script**: Run `db/addresses.sql` to create MySQL/MariaDB database `addresses`
- **Configuration**: Update `info/info.js` with your database credentials
- **Fallback**: System works with mock data if database unavailable

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (auto-restart)
npm run dev
```

### 4. Access the Application
- **API Server**: http://localhost:3000
- **Web Interface**: http://127.0.0.1:5500/index.html (via Live Server)

## 🧪 End-to-End Testing

### Prerequisites
Before running E2E tests, ensure both services are running:

1. **Start the API Server** (Terminal 1):
```bash
npm start
```
Server runs on: http://localhost:3000

2. **Start the Web Interface** (Terminal 2):
- Open `index.html` with Live Server in VS Code
- Or serve via: http://127.0.0.1:5500/index.html

### Running E2E Tests

#### Option 1: Interactive Test Runner (Recommended)
```bash
npm run cypress:open
```
- Opens Cypress Test Runner GUI
- Select and run tests individually
- Real-time debugging and screenshots
- Perfect for development and debugging

#### Option 2: Headless Test Execution
```bash
# Run all test files
npm run cypress:run

# Run specific test file
npx cypress run --spec "00_Cypress/test-test.cy.js"
```

#### Option 3: Custom Test Scripts
```bash
# Run comprehensive test suite (alias)
npm run test:e2e
```

### Test Files Overview
| Test File | Focus Area |
|-----------|------------|
| `test-test.cy.js` | Complete E2E test suite with dropdown options, data validation, and performance testing |

### Test Coverage Areas
- **Basic Functionality**: Page load, form validation, API integration
- **Dropdown Options**: All 7 partial generation options  
- **Data Validation**: CPR format, phone numbers, addresses
- **Performance**: 100-person generation stress test
- **Error Handling**: API failures, invalid inputs
- **Accessibility**: ARIA labels, keyboard navigation
- **UI Responsiveness**: Mobile, tablet, desktop viewports

### Troubleshooting Tests
If tests fail, check:
1. **API Server**: Ensure http://localhost:3000 is accessible
2. **Web Interface**: Ensure http://127.0.0.1:5500/index.html loads
3. **Port Conflicts**: Check if ports 3000 or 5500 are in use
4. **Dependencies**: Run `npm install` to ensure all packages installed

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cpr` | Generate CPR number only |
| GET | `/name-gender` | Generate name and gender |
| GET | `/name-gender-dob` | Generate name, gender, and date of birth |
| GET | `/cpr-name-gender` | Generate CPR, name, and gender |
| GET | `/cpr-name-gender-dob` | Generate CPR, name, gender, and DOB |
| GET | `/address` | Generate address only |
| GET | `/phone` | Generate phone number only |
| GET | `/person` | Generate complete person data |
| GET | `/person?n=<number>` | Generate multiple persons (1-100) |

### Query Parameters
- `n`: Number of persons to generate (1-100, default: 1)

## API Sample Output
`GET /cpr`
```json
{
    "CPR": "0412489054"
}
```

`GET /person`
```json
{
    "CPR": "0107832911",
    "firstName": "Michelle W.",
    "lastName": "Henriksen",
    "gender": "female",
    "birthDate": "1983-07-01",
    "address": {
        "street": "GYØVCoØMeceOjøtÆgvYrøQQDascNFCHArnSNrxub",
        "number": "521",
        "floor": 74,
        "door": "tv",
        "postal_code": "8670",
        "town_name": "Låsby"
    },
    "phoneNumber": "58676658"
}
```

`GET /person&n=3`
```json
[
    {
        "CPR": "2411576095",
        "firstName": "Laurits S.",
        "lastName": "Kjeldsen",
        "gender": "male",
        "birthDate": "1957-11-24",
        "address": {
            "street": "aÅGgøhIbJXVsRÆøjLnåæFoXtsgU Ø NINFYwBnaø",
            "number": "413",
            "floor": 46,
            "door": "tv",
            "postal_code": "8700",
            "town_name": "Horsens"
        },
        "phoneNumber": "35753186"
    },
    {
        "CPR": "1008114708",
        "firstName": "Tristan M.",
        "lastName": "Christoffersen",
        "gender": "male",
        "birthDate": "2011-08-10",
        "address": {
            "street": "dÅJaKxnRqdRbtxaUyviQBxZÅu JozfbyonuCgNXA",
            "number": "77K",
            "floor": 82,
            "door": 44,
            "postal_code": "3210",
            "town_name": "Vejby"
        },
        "phoneNumber": "69712398"
    },
    {
        "CPR": "0507110046",
        "firstName": "Thomas E.",
        "lastName": "Olsen",
        "gender": "male",
        "birthDate": "1911-07-05",
        "address": {
            "street": "m tfYxXøBxmhadvtIHwWvTWEEIRjOÆglcHigsVjb",
            "number": "184",
            "floor": 3,
            "door": "th",
            "postal_code": "7950",
            "town_name": "Erslev"
        },
        "phoneNumber": "38907752"
    }
]
```

## 📁 Project Structure

```
fake_info/
├── 00_Cypress/                    # Cypress E2E tests
│   ├── basic-test.cy.js           # Basic functionality tests
│   ├── dropdown-options-test.cy.js # Dropdown option tests  
│   ├── fake-info-test.cy.js       # Comprehensive test suite
│   └── robust-test.cy.js          # Robust testing scenarios
├── data/
│   └── person-names.json          # Danish names database
├── db/
│   └── addresses.sql              # Database setup script
├── info/
│   └── info.js                    # Database configuration
├── src/
│   ├── DB.js                      # Database connection wrapper
│   ├── FakeInfo.js                # Main data generation class
│   └── Town.js                    # Postal code/town generator
├── cypress.config.js              # Cypress configuration
├── index.html                     # Web interface
├── index.js                       # Express server
└── package.json                   # Dependencies & scripts
```

## 🔧 Core Classes

### `FakeInfo` Class - Public Methods
```javascript
- getCPR(): string
- getFullNameAndGender(): object  
- getFullNameGenderAndBirthDate(): object
- getCprFullNameAndGender(): object
- getCprFullNameGenderAndBirthDate(): object
- getAddress(): object
- getPhoneNumber(): string
- getFakePerson(): object
- getFakePersons(amount: number): array
```

### Sample Usage
```javascript
const FakeInfo = require('./src/FakeInfo');
const fakeInfo = new FakeInfo();

// Generate single person
const person = await fakeInfo.getFakePerson();
console.log(person);

// Generate multiple persons
const persons = await fakeInfo.getFakePersons(5);
console.log(persons);
```

## 🌟 Features

### Danish Localization
- **CPR Numbers**: Valid format with gender logic
- **Names**: Authentic Danish first/last names
- **Phone Numbers**: Valid Danish mobile prefixes
- **Addresses**: Real postal codes and Danish town names

### Testing Framework
- **Complete Test Coverage**: All functionality tested
- **Dropdown Testing**: All 7 partial generation options
- **Performance Testing**: 100-person generation
- **Error Handling**: API failure scenarios
- **Accessibility**: WCAG compliance checks

## 🛠️ Technology Stack
- **Backend**: Node.js + Express.js
- **Database**: MySQL/MariaDB (optional)
- **Testing**: Cypress E2E Framework
- **Frontend**: Vanilla HTML/CSS/JavaScript

## 👨‍💻 Authors
- **Original PHP Version**: Arturo Mora-Rioja
- **Node.js Conversion & Testing**: [Current Developer]