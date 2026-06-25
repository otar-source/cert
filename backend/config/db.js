/** @format */

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "user",
	connectionLimit: 10,
	queueLimit: 0,
	// waitForConnections: true,
});

async function initializeDB() {
	try {
		const connection = await pool.getConnection();

		await connection.execute(`CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            town VARCHAR(255) NOT NULL UNIQUE,
            CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
		connection.release();
		console.log("Database initialization  successful");
	} catch (error) {
		console.error("Database initialization failed", error);
	}
}

module.exports = { pool, initializeDB };
