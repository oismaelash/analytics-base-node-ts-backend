
const mysql2 = require('mysql2')

export const mysqlService = async (sql: string) => {
    try {
        let connectionConfig = {
            uri: process.env.DATABASE_URL,
            connectionLimit: 10,
            waitForConnections: true,
        };
        console.log('connectionConfig', connectionConfig)

        const pool = mysql2.createPool(connectionConfig).promise();
        const [rows] = await pool.query(sql);
        pool.end()
        return rows;
    } catch (error) {
        throw new Error(`Error mysqlService: ${error}`);
    }
}