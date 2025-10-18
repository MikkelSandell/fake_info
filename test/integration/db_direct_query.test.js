// Sikr dig at din Town-klasse er eksporteret fra src/Town.js
const Town = require('../../src/Town'); 

// Vælg et postnummer, der beviseligt er i din database (og som ikke er i mock-listen!)
const KNOWN_POSTAL_CODE = '9900'; 
const EXPECTED_TOWN_NAME = 'Frederikshavn'; 

describe('Database Direct Query Integration Test', () => {
    let town;

    beforeAll(async () => {
        // 1. Opret forbindelse FØR alle tests
        town = new Town();
        await town.connect(); 
    });

    afterAll(async () => {
        // 2. Luk forbindelsen EFTER alle tests er færdige (vigtigt for at undgå leaks!)
        if (town) {
            await town.disconnect(); 
        }
    });

    test(`should successfully fetch the known town ${KNOWN_POSTAL_CODE} directly from the database`, async () => {
        
        // Direkte SQL-forespørgsel for at teste query-metoden og DB'en
        const sql = `
            SELECT cPostalCode AS postal_code, cTownName AS town_name
            FROM postal_code
            WHERE cPostalCode = ?;
        `;
        
        // Kører SQL-forespørgslen med en parameter:
        const rows = await town.query(sql, [KNOWN_POSTAL_CODE]);
        
        // 1. Tjek, at vi fik præcis ét resultat
        expect(rows.length).toBe(1);

        const result = rows[0];

        // 2. Tjek, at postnummeret og bynavnet matcher den forventede DB-værdi
        expect(result.postal_code).toBe(KNOWN_POSTAL_CODE);
        expect(result.town_name).toBe(EXPECTED_TOWN_NAME);
    });
});