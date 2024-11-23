require('dotenv').config();

const knex = require('knex')({
    client: 'mysql2', 
    connection: {
        host:'dbfacul.c1k4e8ay2llk.us-east-2.rds.amazonaws.com',
        port: 3306,
        user: 'admin',
        password: '3Filhosmja',
        database: 'projetopi'
    }
});

module.exports = knex;

