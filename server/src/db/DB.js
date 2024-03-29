const path = require('path');

const mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();
const mySqlInstance = require('./MySqlInstance');
const sqliteInstance = require('./SqliteInstance');

class DB {
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
                new sqlite3.Database(path.normalize(process.cwd() + '/kyndaDatabase.sqlite3'), (err) => {
                    if (err !== null) throw err;
                })
            );
        } else {
            console.log(
                'process.env.APP_ENV is not production or local, is the .env file missing?'
            );
            process.exit();
        }
    }
}

module.exports = DB;
