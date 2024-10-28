const mariadb = require('mariadb');

const pool = mariadb.createPool({
    user: 'root',
    password: '',
    database: 'gsb',
    servername: 'localhost'
});

module.exports = pool;