const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    port : process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

connection.connect((err)=>{
    if(err) {
        console.log(`Error while connecting to MySQL - ${err}`);
        throw err;
    }
    console.log("Database Connection established!", process.env.PORT);
});


module.exports = connection;