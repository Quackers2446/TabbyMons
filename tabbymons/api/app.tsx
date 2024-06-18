import pool from './database';

async function runQueries() {
    try {
        const connection = await pool.getConnection();

        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      )
    `);
        console.log('Table created successfully.');

        const [insertResult]: any = await connection.query(`
      INSERT INTO users (name, email) VALUES (?, ?)
    `, ['John Doe', 'john.doe@example.com']);

        console.log('Record inserted successfully, ID:', insertResult.insertId);

        const [rows]: any = await connection.query(`
      SELECT * FROM users
    `);
        console.log('Records selected:', rows);

        connection.release();
    } catch (error) {
        console.error('Error executing queries:', error);
    }
}

runQueries();
