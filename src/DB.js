// @flow
const mysql = require('mysql2/promise');
const info = require('../info/info.js');

/**
 * Encapsulates a connection to the database 
 * * @author 	Arturo Mora-Rioja
 * @version 1.0 October 2025
 */
class DB {
    constructor() {
        this.connection = null;
    }

    /**
     * Opens a connection to the database
     */
    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: info.HOST,
                database: info.DB_NAME,
                user: info.USER,
                password: info.PASSWORD,
                port: info.PORT, // RETTET: Skal være info.PORT for at matche konfigurationen
                charset: 'utf8mb4'
            });
            console.log('Database connection successful');
        } catch (error) {
            console.error('Connection unsuccessful: ' + error.message);
            throw error;
        }
    }

    /**
     * Closes the database connection
     */
    async disconnect() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
        }
    }

    /**
     * Execute a query
     */
    async query(sql, params = []) {
        if (!this.connection) {
            await this.connect();
        }
        try {
            const [rows] = await this.connection.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Query error: ' + error.message);
            throw error;
        }
    }
}

module.exports = DB;