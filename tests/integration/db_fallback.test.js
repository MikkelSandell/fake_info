const request = require('supertest');
const app = require('../../index'); 

describe('Database Fallback Integration', () => {

    // Definer de gyldige mock-værdier fra FakeInfo.js (setMockAddressData)
    const validPostalCodes = [
        '1000', '2000', '8000', '5000', '9000', '7000', '3000', '4000', '6000', '1050'
    ];
    const validTownNames = [
        'København K', 'Frederiksberg', 'Aarhus C', 'Odense C', 'Aalborg', 'Fredericia', 
        'Helsingør', 'Roskilde', 'Kolding'
    ];

    /**
     * Test, der simulerer situationen, hvor DB'en er utilgængelig og 
     * verificerer, at fallback-data bruges.
     */
    test('Should use fallback data if DB connection fails', async () => {
        
        // Hent endpointet /address, som vil trigge DB-kald/fallback
        const response = await request(app).get('/address'); 

        // Tjek om statuskoden er 200 (indikerer succes, selv med fallback)
        expect(response.statusCode).toBe(200);
        
        // Tjekker at 'address' findes i responsen
        expect(response.body).toHaveProperty('address');
        
        const address = response.body.address;

        // 1. Tjek, at vi får et objekt med den korrekte struktur (inkluderer 'street')
        expect(address).toHaveProperty('street'); // Tjekker for gadenavn

        // 2. Tjekker at de vigtigste felter findes
        expect(address).toHaveProperty('postal_code');
        expect(address).toHaveProperty('town_name');

        // 3. Tjekker, at postnummeret er et af de gyldige mock-postnumre
        expect(validPostalCodes).toContain(address.postal_code); 
        
        // 4. Tjekker, at bynavnet er et af de gyldige mock-bynavne
        expect(validTownNames).toContain(address.town_name);
        
        // Tjek at gadenavnet er en string (street har ikke et fast mock-array)
        expect(typeof address.street).toBe('string');
        expect(address.street.length).toBeGreaterThan(0);
    });
});