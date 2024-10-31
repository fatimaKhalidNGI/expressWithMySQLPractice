const mysql = require('mysql2/promise');

const dbConfig = {
    host : 'localhost',
    user : 'root',
    password : 'fatima123',
    database : 'my_db_practice'
};

const dbPool = mysql.createPool(dbConfig);

module.exports = { dbPool };