const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'clave',
    database: 'condomanagerdev',
    multipleStatements: true
});

mysqlConnection.connect(function (err) {
    if(err){
        console.log(err);
        return;
    } else {
        console.log('La base de datos está conectada');
    }
});

module.exports = mysqlConnection;

