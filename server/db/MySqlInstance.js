const BaseSqlInstance = require('./BaseSqlInstance');

class MySqlInstance extends BaseSqlInstance {
    constructor(conn) {
        super();

        this.connection = conn;

        this.connection.connect((err) => {
            if (err) throw err;
        });
    }

    runStatements() {}

    endConnection() {
        this.connection.end();
    }
}

module.exports = { instance: MySqlInstance };
