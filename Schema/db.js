const mysql = require('mysql');


const db = mysql.createPool({
    // connectionLimit: 10,
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'support_log'
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'service_call_book'
});

db.getConnection((err, connection) => {
    if (err) console.log(err);
    connection.release();
    return;
})

module.exports = db;