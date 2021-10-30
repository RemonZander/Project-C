const BaseSqlInstance = require('./BaseSqlInstance');

class SqliteInstance extends BaseSqlInstance {
    constructor(db) {
        super();
        this.db = db;
    }

    runStatement(query, values) {
        return this.db.run(query, values, (err) => {
            if (err) throw err;
        });
    }

    runStatements() {
        this.db.serialize(() => {
            for (let i = 0; i < this.preparedStatements.length; i++) {
                const stmt = this.preparedStatements[i];

                this.db.run(stmt.query, stmt.values, (err) => {
                    if (err) throw err;

                    console.log('All good baby');
                });
            }

            this.preparedStatements = [];
        });
    }

    endConnection() {
        this.db.close();
    }
}

module.exports = { instance: SqliteInstance };
