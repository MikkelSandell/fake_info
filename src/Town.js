const DB = require('./DB.js');

/**
 * Class Town.
 * It generates random postal codes and town names.
 * 
 * @author  Arturo Mora-Rioja
 * @version 1.0.0 October 2025
 */
class Town extends DB {
    static townCount = 0;

    /**
     * The total number of towns is saved in a static property.
     * By making it static, the calculation will be made only once
     */
    constructor() {
        super();
    }

    /**
     * Initialize town count if not already done
     */
    async initializeTownCount() {
        if (Town.townCount === 0) {
            const sql = `
                SELECT COUNT(*) AS total
                FROM postal_code;
            `;
            const rows = await this.query(sql);
            Town.townCount = rows[0].total;
        }
    }

    /**
     * Generates a random postal code and town
     * based on the values in the addresses database
     * 
     * @return object {postal_code: value, town_name: value}
     */
    async getRandomTown() {
        await this.initializeTownCount();
        
        const randomTown = Math.floor(Math.random() * Town.townCount);
        const sql = `
            SELECT cPostalCode AS postal_code, cTownName AS town_name
            FROM postal_code
            LIMIT ?, 1;
        `;
        
        const rows = await this.query(sql, [randomTown]);
        return rows[0];
    }
}

module.exports = Town;