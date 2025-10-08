const express = require('express');
const cors = require('cors');
const FakeInfo = require('./src/FakeInfo.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Error constants
const ERROR_METHOD = 0;
const ERROR_ENDPOINT = 1;
const ERROR_PARAMS = 2;

/**
 * Reports error with appropriate HTTP status code and message
 * @param {Response} res - Express response object
 * @param {number} error - Error type constant
 */
function reportError(res, error = -1) {
    let statusCode, message;
    
    switch (error) {
        case ERROR_METHOD:
            statusCode = 405;
            message = 'Incorrect HTTP method';
            break;
        case ERROR_ENDPOINT:
            statusCode = 404;
            message = 'Incorrect API endpoint';
            break;
        case ERROR_PARAMS:
            statusCode = 400;
            message = 'Incorrect GET parameter value';
            break;
        default:
            statusCode = 500;
            message = 'Unknown error';
    }
    
    res.status(statusCode).json({
        error: message
    });
}

// Routes
app.get('/cpr', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json({ CPR: fakePerson.getCpr() });
    } catch (error) {
        console.error('Error generating CPR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/name-gender', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json(fakePerson.getFullNameAndGender());
    } catch (error) {
        console.error('Error generating name-gender:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/name-gender-dob', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json(fakePerson.getFullNameGenderAndBirthDate());
    } catch (error) {
        console.error('Error generating name-gender-dob:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/cpr-name-gender', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json(fakePerson.getCprFullNameAndGender());
    } catch (error) {
        console.error('Error generating cpr-name-gender:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/cpr-name-gender-dob', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json(fakePerson.getCprFullNameGenderAndBirthDate());
    } catch (error) {
        console.error('Error generating cpr-name-gender-dob:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/address', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json(fakePerson.getAddress());
    } catch (error) {
        console.error('Error generating address:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/phone', async (req, res) => {
    try {
        const fakePerson = new FakeInfo();
        await fakePerson.initialize();
        res.json({ phoneNumber: fakePerson.getPhoneNumber() });
    } catch (error) {
        console.error('Error generating phone:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/person', async (req, res) => {
    try {
        const numPersons = req.query.n ? Math.abs(parseInt(req.query.n)) : 1;
        
        switch (true) {
            case numPersons === 0:
                return reportError(res, ERROR_PARAMS);
            case numPersons === 1:
                const fakePerson = new FakeInfo();
                await fakePerson.initialize();
                res.json(fakePerson.getFakePerson());
                break;
            case numPersons > 1 && numPersons <= 100:
                const persons = await FakeInfo.getFakePersons(numPersons);
                res.json(persons);
                break;
            default:
                return reportError(res, ERROR_PARAMS);
        }
    } catch (error) {
        console.error('Error generating person(s):', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle non-GET requests
app.all('*', (req, res) => {
    if (req.method !== 'GET') {
        return reportError(res, ERROR_METHOD);
    }
    return reportError(res, ERROR_ENDPOINT);
});

// Start server
app.listen(PORT, () => {
    console.log(`Fake Info API server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /cpr`);
    console.log(`  GET /name-gender`);
    console.log(`  GET /name-gender-dob`);
    console.log(`  GET /cpr-name-gender`);
    console.log(`  GET /cpr-name-gender-dob`);
    console.log(`  GET /address`);
    console.log(`  GET /phone`);
    console.log(`  GET /person`);
    console.log(`  GET /person?n=<number_of_fake_persons>`);
});

module.exports = app;