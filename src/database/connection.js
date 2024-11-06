require('dotenv').config();

const knex = require('knex')({
    client: 'mysql2', 
    connection: {
        host: 'dbfacul.c1k4e8ay2llk.us-east-2.rds.amazonaws.com',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

module.exports = knex;
