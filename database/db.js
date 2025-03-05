const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    user: 'root',
    password: '',
    database: 'gsb',
    host: '127.0.0.1'
});

module.exports = pool;
