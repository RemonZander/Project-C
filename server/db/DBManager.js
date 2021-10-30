const path = require('path');

const mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();
const mySqlInstance = require('./MySqlInstance').instance;
const sqliteInstance = require('./SqliteInstance').instance;

class DBManager {
    startConnection(
        options = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        }
    ) {
        if (process.env.APP_ENV === 'production') {
            return new mySqlInstance(mysql.createConnection(options));
        } else if (process.env.APP_ENV === 'local') {
            return new sqliteInstance(
                new sqlite3.Database(path.normalize(__dirname + '../../../kyndaDatabase.sqlite3'))
            );
        }
    }
}

module.exports = { DBManager: DBManager };
