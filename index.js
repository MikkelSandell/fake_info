const express = require('express');
const cors = require('cors');
const FakeInfo = require('./src/FakeInfo.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error constants
const ERROR_METHOD = 0;
const ERROR_ENDPOINT = 1;
const ERROR_PARAMS = 2;

// Vi beholder én global instans KUN til synkront genererede data (CPR, navn, tlf), 
// da de ikke kræver den asynkrone initialize() metode og sparer ressourcer.
const fakeInfoGeneratorSync = new FakeInfo();


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

// ------------------------------------
// SYNKRONE ROUTES (Bruger global instans)
// ------------------------------------

app.get('/cpr', (req, res) => {
    try {
        res.json({ CPR: fakeInfoGeneratorSync.getCpr() });
    } catch (error) {
        console.error('Error generating CPR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/name-gender', (req, res) => {
    try {
        res.json(fakeInfoGeneratorSync.getFullNameAndGender());
    } catch (error) {
        console.error('Error generating name-gender:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/name-gender-dob', (req, res) => {
    try {
        res.json(fakeInfoGeneratorSync.getFullNameGenderAndBirthDate());
    } catch (error) {
        console.error('Error generating name-gender-dob:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/cpr-name-gender', (req, res) => {
    try {
        res.json(fakeInfoGeneratorSync.getCprFullNameAndGender());
    } catch (error) {
        console.error('Error generating cpr-name-gender:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/cpr-name-gender-dob', (req, res) => {
    try {
        res.json(fakeInfoGeneratorSync.getCprFullNameGenderAndBirthDate());
    } catch (error) {
        console.error('Error generating cpr-name-gender-dob:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/phone', (req, res) => {
    try {
        res.json({ phoneNumber: fakeInfoGeneratorSync.getPhoneNumber() });
    } catch (error) {
        console.error('Error generating phone:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ------------------------------------
// ASYNKRONE ROUTES (Skal oprette ny instans og await initialize())
// ------------------------------------

app.get('/address', async (req, res) => {
    try {
        // Opretter en NY instans.
        const fakePerson = new FakeInfo();
        // VIGTIGT: Awaiter initialize() for at sikre address data (DB/fallback) er til stede.
        await fakePerson.initialize(); 

        res.json(fakePerson.getAddress());
    } catch (error) {
        console.error('Error generating address:', error);
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
                // Opretter en NY instans for enkeltperson.
                const fakePerson = new FakeInfo();
                // VIGTIGT: Awaiter initialize() for at få adresse-data.
                await fakePerson.initialize(); 
                res.json(fakePerson.getFakePerson());
                break;
                
            case numPersons > 1 && numPersons <= 100:
                // Static metoden FakeInfo.getFakePersons håndterer initialize() internt.
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

// VIGTIGT: Eksporter Express app'en, så tests kan importere den
module.exports = app;

/**
 * Starter applikationsserveren KUN, hvis filen køres direkte 
 * (dvs. 'node index.js' eller 'npm start'). 
 * Initialiseringen af den globale synkrone instans sker her.
 */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    // Før serverstart: Vi initialiserer den synkrone instans (selvom den reelt kun opretter adresse-data).
    // Dette er kun nødvendigt, hvis du vil se DB/fallback loggen ved opstart.
    // Bemærk: Denne initialisering er IKKE den, der bruges af integrationstests.
    fakeInfoGeneratorSync.initialize()
        .then(() => {
            // Start server
            app.listen(PORT, () => {
                console.log(`Fake Info API server running on port ${PORT}`);
                console.log(`Available endpoints:`);
                console.log(`   GET /cpr`);
                console.log(`   GET /name-gender`);
                console.log(`   GET /name-gender-dob`);
                console.log(`   GET /cpr-name-gender`);
                console.log(`   GET /cpr-name-gender-dob`);
                console.log(`   GET /address`);
                console.log(`   GET /phone`);
                console.log(`   GET /person`);
                console.log(`   GET /person?n=<number_of_fake_persons>`);
            });
        })
        .catch(err => {
            console.error('FATAL ERROR: Could not initialize FakeInfo generator (DB issue). Exiting.', err);
            // Hvis initialiseringen fejler, stopper vi applikationen.
            process.exit(1);
        });
}