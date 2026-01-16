import mysql from 'mysql2/promise';

// Create a connection pool for MySQL
const dbConfig = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "examen",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default dbConfig;