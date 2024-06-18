import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'my_user',
  password: 'user_password',
  database: 'my_database',
  port: 3307
});

export default pool;
