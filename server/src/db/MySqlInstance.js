const BaseSqlInstance = require('./BaseSqlInstance');
const SQLException = require('../exceptions/SQLException');

class MySqlInstance extends BaseSqlInstance {
    constructor(conn) {
        super();

        this.connection = conn;

        this.connection.connect((err) => {
            if (err) throw err;
        });
    }

    runStatement(query, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, values, (err, results, fields) => {
                if (err) reject(new SQLException(err));

                resolve(results);
            });
        });
    }

    runStatements() {
        for (let i = 0; i < this.preparedStatements.length; i++) {
            const stmt = this.preparedStatements[i];

            this.runStatement(stmt.query, stmt.values);
        }
    }

    endConnection() {
        this.connection.end();
    }
}

module.exports = MySqlInstance;
