const request = require('supertest');
const app = require('../../index'); // Antager at 'index.js' eksporterer din Express app

describe('API Endpoint Integration Tests', () => {

    // Test 1: Simpel generering og statuskode
    test('GET /cpr should return status 200 and a 10-digit CPR', async () => {
        const response = await request(app).get('/cpr');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('CPR');
        expect(response.body.CPR).toHaveLength(10);
    });

    // Test 2: Validering af CPR/Køn-sammenhæng 
    test('GET /cpr-name-gender should return valid CPR for gender constraint', async () => {
        const response = await request(app).get('/cpr-name-gender');
        expect(response.statusCode).toBe(200);
        
        const { CPR, gender } = response.body;

        // Bestem om sidste ciffer skal være lige (kvinde) eller ulige (mand)
        const lastDigit = parseInt(CPR.slice(-1));
        
        if (gender === 'female') {
            // Skal være lige (0, 2, 4, 6, 8)
            expect(lastDigit % 2).toBe(0); 
        } else if (gender === 'male') {
            // Skal være ulige (1, 3, 5, 7, 9)
            expect(lastDigit % 2).toBe(1);
        }
    });
    
    // Test 3: Bulk Generering Grænse/Begrænsning
    test('GET /person?n=101 should fail with status 400', async () => {
        const response = await request(app).get('/person?n=101');
        expect(response.statusCode).toBe(400); // Bad Request for ugyldig grænse
        expect(response.body).toHaveProperty('error');
    });

    // Test 4: Kontraktvalidering af fuldt person-objekt
    test('GET /person returns a complete person with all required nested fields', async () => {
        const response = await request(app).get('/person');
        expect(response.statusCode).toBe(200);
        
        const person = response.body;
        
        // Verificér de øverste felter
        expect(person).toHaveProperty('firstName');
        expect(person).toHaveProperty('birthDate');
        expect(person).toHaveProperty('phoneNumber');
        
        // Verificér Address-objektet (integration med Address-delen)
        expect(person.address).toHaveProperty('street');
        expect(person.address).toHaveProperty('postal_code');
        expect(person.address).toHaveProperty('town_name');
        
        // Verificér at fødselsdato matcher CPR (Kritisk dataintegritet)
        const cprDate = person.CPR.substring(0, 6);
        // birthDate format: YYYY-MM-DD
        const [day, month, year] = [
            person.birthDate.substring(8, 10), // DD
            person.birthDate.substring(5, 7),  // MM
            person.birthDate.substring(2, 4)   // YY
        ];
        expect(cprDate).toBe(`${day}${month}${year}`);
    });
});
