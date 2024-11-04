const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    user: 'root',
    password: '',
    database: 'gsb',
    servername: 'localhost'
});

module.exports = pool;