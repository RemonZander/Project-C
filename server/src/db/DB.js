const path = require('path');

const mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();
const mySqlInstance = require('./MySqlInstance');
const sqliteInstance = require('./SqliteInstance');

class DB {
    startConnection() {
        if (process.env.NODE_ENV === 'production') {
            return new mySqlInstance(
                mysql.createConnection({
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                })
            );
        } else if (process.env.NODE_ENV === 'development') {
            return new sqliteInstance(
                new sqlite3.Database(path.normalize(process.cwd() + '/kyndaDatabase.sqlite3'), (err) => {
                    if (err !== null) throw err;
                })
            );
        } else {
            throw Error("Is NODE_ENV perhaps not defined?")
        }
    }
}

module.exports = DB;
