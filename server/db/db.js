const mysql = require('mysql');

class DBManager {
    constructor(
        options = {
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true,
        }
    ) {
        this.options = options;
    }

    startConnection() {
        this.connection = mysql.createConnection(this.options);

        this.connection.connect((err) => {
            if (err) throw err;
        });

        return this;
    }

    setDB(dbName) {
        this.connection.changeUser({ database: dbName });

        return this;
    }

    query(query) {
        this.connection.query(query, (err, result, fields) => {
            if (err) console.error(err);
        });
    }

    insertInto(tableName, cols, values) {
        this.query(
            `
            INSERT INTO ${tableName} (${cols.join()}) 
            VALUES (${this.connection.escape(values.join())})
            `
        );

        return this;
    }

    endConnection() {
        this.connection.end();
    }
}

module.exports = { DBManager: DBManager };
