const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

pool.connect((err) => {
    if (err) {
        console.log('Failed to connect database', err.stack)
    }
    console.log('Database is connected')
});

module.exports = pool;