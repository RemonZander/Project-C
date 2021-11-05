const path = require('path');

const mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();
const mySqlInstance = require('./MySqlInstance').instance;
const sqliteInstance = require('./SqliteInstance').instance;

class DBManager {
    startConnection() {
        if (process.env.APP_ENV === 'production') {
            return new mySqlInstance(
                mysql.createConnection({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                })
            );
        } else if (process.env.APP_ENV === 'local') {
            return new sqliteInstance(
                new sqlite3.Database(path.normalize(__dirname + '../../../kyndaDatabase.sqlite3'))
            );
        } else {
            console.log(
                'process.env.APP_ENV is not production or local, is the .env file missing?'
            );
            process.exit();
        }
    }
}

module.exports = { DBManager: DBManager };
